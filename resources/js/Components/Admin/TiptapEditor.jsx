import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { motion, AnimatePresence } from 'framer-motion';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { 
    Bold, 
    Italic, 
    Strikethrough, 
    Heading1,
    Heading2, 
    Heading3, 
    List, 
    ListOrdered, 
    Quote, 
    Link as LinkIcon, 
    Unlink, 
    Image as ImageIcon, 
    Undo, 
    Redo,
    Code,
    X,
    Check,
    Globe,
    Upload,
    ChevronDown,
    AlertCircle
} from 'lucide-react';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Toolbar Button Component
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ToolbarBtn({ active, onClick, title, children, disabled = false }) {
    return (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onClick) onClick(e);
            }}
            title={title}
            disabled={disabled}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs transition-all duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                active
                    ? 'bg-[#800020] text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
        >
            {children}
        </button>
    );
}

function ToolbarSep() {
    return <div className="w-px h-4 bg-slate-200 mx-1 shrink-0" />;
}

export default function TiptapEditor({ content = '', onChange, placeholder = 'Tulis isi konten artikel di sini...' }) {
    // Tiptap — forceUpdate ensures toolbar re-renders on every transaction
    const [, forceUpdate] = useState(0);

    // Image Dropdown Menu State
    const [imageDropdownOpen, setImageDropdownOpen] = useState(false);
    const imageDropdownRef = useRef(null);
    const fileInputRef = useRef(null);

    // Custom Link Modal States
    const [linkModalOpen, setLinkModalOpen] = useState(false);
    const [linkText, setLinkText] = useState('');
    const [linkUrl, setLinkUrl] = useState('');

    // Custom Image URL Modal States
    const [imgModalOpen, setImgModalOpen] = useState(false);
    const [imgUrl, setImgUrl] = useState('');
    const [imgAlt, setImgAlt] = useState('');
    const [imgLoadError, setImgLoadError] = useState(false);

    // Click outside listener for image dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (imageDropdownRef.current && !imageDropdownRef.current.contains(event.target)) {
                setImageDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[#800020] underline hover:text-[#5c0017] cursor-pointer font-medium',
                },
            }),
            Image.configure({
                inline: false,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'rounded-2xl max-w-full my-4 border border-slate-200 shadow-xs block mx-auto',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: content || '',
        onTransaction: () => {
            forceUpdate((prev) => prev + 1);
        },
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange(editor.getHTML());
            }
        },
        editorProps: {
            attributes: {
                class: "tiptap tiptap-editor focus:outline-none min-h-[300px] p-4 sm:p-6 text-sm sm:text-base font-light text-slate-800 leading-relaxed",
            },
        },
    });

    // Open Custom Link Modal
    const handleOpenLinkModal = useCallback(() => {
        if (!editor) return;

        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to, ' ');
        const currentUrl = editor.getAttributes('link').href || '';

        setLinkText(selectedText);
        setLinkUrl(currentUrl);
        setLinkModalOpen(true);
    }, [editor]);

    // Save Custom Link (NO PAGE RELOAD)
    const handleSaveLink = useCallback((e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!editor) return;

        if (!linkUrl.trim()) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            setLinkModalOpen(false);
            if (onChange) onChange(editor.getHTML());
            return;
        }

        const formattedUrl = linkUrl.startsWith('http://') || linkUrl.startsWith('https://') || linkUrl.startsWith('mailto:') || linkUrl.startsWith('tel:')
            ? linkUrl.trim()
            : `https://${linkUrl.trim()}`;

        const { from, to } = editor.state.selection;
        const hasSelection = from !== to;

        if (!hasSelection && linkText.trim()) {
            editor.chain().focus().insertContent({
                type: 'text',
                text: linkText.trim(),
                marks: [{ type: 'link', attrs: { href: formattedUrl } }],
            }).run();
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: formattedUrl }).run();
        }

        setLinkModalOpen(false);
        if (onChange) onChange(editor.getHTML());
    }, [editor, linkUrl, linkText, onChange]);

    // Remove Link
    const handleRemoveLink = useCallback((e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!editor) return;
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        setLinkModalOpen(false);
        if (onChange) onChange(editor.getHTML());
    }, [editor, onChange]);

    // Open Custom Image Modal
    const handleOpenImageUrlModal = useCallback((e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setImageDropdownOpen(false);
        setImgUrl('');
        setImgAlt('');
        setImgLoadError(false);
        setImgModalOpen(true);
    }, []);

    // Save Image from URL Modal (NO PAGE RELOAD)
    const handleSaveImageUrl = useCallback((e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const trimmedUrl = imgUrl.trim();
        if (!editor || !trimmedUrl) return;

        // Insert image with exact URL supplied by user
        editor.chain().focus().setImage({ 
            src: trimmedUrl,
            alt: imgAlt.trim() || undefined
        }).run();

        setImgModalOpen(false);
        if (onChange) onChange(editor.getHTML());
    }, [editor, imgUrl, imgAlt, onChange]);

    // Handle Local File Upload from device (NO PAGE RELOAD)
    const handleLocalImageSelect = useCallback((e) => {
        const file = e.target.files?.[0];
        if (!file || !editor) return;

        setImageDropdownOpen(false);

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Url = event.target?.result;
            if (base64Url && typeof base64Url === 'string') {
                editor.chain().focus().setImage({ 
                    src: base64Url,
                    alt: file.name
                }).run();

                if (onChange) onChange(editor.getHTML());
            }
        };
        reader.readAsDataURL(file);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [editor, onChange]);

    if (!editor) {
        return (
            <div className="w-full h-72 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-light">
                Memuat Tiptap Editor...
            </div>
        );
    }

    return (
        <div className="w-full rounded-2xl border border-slate-200 overflow-visible bg-white shadow-2xs focus-within:border-[#800020] focus-within:ring-1 focus-within:ring-[#800020] transition-all relative">
            
            {/* Hidden File Input for Local Image Upload */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLocalImageSelect}
                className="hidden"
            />

            {/* Rich Text Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 text-slate-700 rounded-t-2xl">
                
                {/* Undo */}
                <ToolbarBtn
                    title="Undo (Urungkan)"
                    active={false}
                    disabled={!editor.can().undo()}
                    onClick={() => editor.chain().focus().undo().run()}
                >
                    <Undo className="w-4 h-4" />
                </ToolbarBtn>

                {/* Redo */}
                <ToolbarBtn
                    title="Redo (Ulangi)"
                    active={false}
                    disabled={!editor.can().redo()}
                    onClick={() => editor.chain().focus().redo().run()}
                >
                    <Redo className="w-4 h-4" />
                </ToolbarBtn>

                <ToolbarSep />

                {/* Bold */}
                <ToolbarBtn
                    title="Tebal (Bold)"
                    active={editor.isActive('bold')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold className="w-4 h-4" />
                </ToolbarBtn>

                {/* Italic */}
                <ToolbarBtn
                    title="Miring (Italic)"
                    active={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="w-4 h-4" />
                </ToolbarBtn>

                {/* Strike */}
                <ToolbarBtn
                    title="Coret (Strikethrough)"
                    active={editor.isActive('strike')}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                    <Strikethrough className="w-4 h-4" />
                </ToolbarBtn>

                <ToolbarSep />

                {/* Heading 1 */}
                <ToolbarBtn
                    title="Judul Utama (H1)"
                    active={editor.isActive('heading', { level: 1 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    <Heading1 className="w-4 h-4" />
                </ToolbarBtn>

                {/* Heading 2 */}
                <ToolbarBtn
                    title="Subjudul Besar (H2)"
                    active={editor.isActive('heading', { level: 2 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading2 className="w-4 h-4" />
                </ToolbarBtn>

                {/* Heading 3 */}
                <ToolbarBtn
                    title="Subjudul Sedang (H3)"
                    active={editor.isActive('heading', { level: 3 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    <Heading3 className="w-4 h-4" />
                </ToolbarBtn>

                <ToolbarSep />

                {/* Bullet List */}
                <ToolbarBtn
                    title="Daftar Poin (Bullet List)"
                    active={editor.isActive('bulletList')}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List className="w-4 h-4" />
                </ToolbarBtn>

                {/* Ordered List */}
                <ToolbarBtn
                    title="Daftar Angka (Ordered List)"
                    active={editor.isActive('orderedList')}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered className="w-4 h-4" />
                </ToolbarBtn>

                {/* Blockquote */}
                <ToolbarBtn
                    title="Kutipan (Quote)"
                    active={editor.isActive('blockquote')}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <Quote className="w-4 h-4" />
                </ToolbarBtn>

                {/* Code Block */}
                <ToolbarBtn
                    title="Blok Kode (Code Block)"
                    active={editor.isActive('codeBlock')}
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                >
                    <Code className="w-4 h-4" />
                </ToolbarBtn>

                <ToolbarSep />

                {/* Link Modal Button */}
                <ToolbarBtn
                    title="Sisipkan / Edit Link"
                    active={editor.isActive('link')}
                    onClick={handleOpenLinkModal}
                >
                    <LinkIcon className="w-4 h-4" />
                </ToolbarBtn>

                {editor.isActive('link') && (
                    <button
                        type="button"
                        onClick={handleRemoveLink}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-xs text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Hapus Link"
                    >
                        <Unlink className="w-4 h-4" />
                    </button>
                )}

                {/* Image Dropdown Trigger Button */}
                <div ref={imageDropdownRef} className="relative">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setImageDropdownOpen(!imageDropdownOpen);
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 h-8 rounded-lg text-xs transition-all duration-150 cursor-pointer ${
                            imageDropdownOpen
                                ? 'bg-[#800020] text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                        }`}
                        title="Sisipkan Gambar (URL Web atau File Lokal)"
                    >
                        <ImageIcon className="w-4 h-4" />
                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${imageDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Image Options Popover */}
                    <AnimatePresence>
                        {imageDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                                transition={{ duration: 0.15, ease: 'easeOut' }}
                                className="absolute left-0 top-full mt-1.5 w-60 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-1.5 space-y-1"
                            >
                                <button
                                    type="button"
                                    onClick={handleOpenImageUrlModal}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-rose-50 hover:text-[#800020] transition-colors cursor-pointer text-left"
                                >
                                    <div className="w-7 h-7 rounded-lg bg-rose-50 text-[#800020] flex items-center justify-center shrink-0">
                                        <Globe className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                        <span className="font-medium block">Sisipkan via URL Web</span>
                                        <span className="text-[10px] text-slate-400 font-light block">Tempel link gambar online</span>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        fileInputRef.current?.click();
                                    }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-rose-50 hover:text-[#800020] transition-colors cursor-pointer text-left"
                                >
                                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                        <Upload className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                        <span className="font-medium block">Upload File Lokal</span>
                                        <span className="text-[10px] text-slate-400 font-light block">Pilih foto dari galeri / laptop</span>
                                    </div>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>

            {/* Editable Content Canvas */}
            <div className="bg-white rounded-b-2xl">
                <EditorContent editor={editor} />
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               Custom Modern Link Modal (Pure Div, No Nested Form)
               ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <AnimatePresence>
                {linkModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setLinkModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="relative bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-5"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#800020] flex items-center justify-center">
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                                            {editor.isActive('link') ? 'Perbarui Link Tautan' : 'Sisipkan Link Tautan'}
                                        </h3>
                                        <p className="text-[11px] text-slate-500 font-light">
                                            Masukkan alamat web URL tujuan
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setLinkModalOpen(false);
                                    }}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-700">Teks Link (Opsional jika teks sudah diblok)</label>
                                    <input
                                        type="text"
                                        value={linkText}
                                        onChange={(e) => setLinkText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleSaveLink(e);
                                            }
                                        }}
                                        placeholder="Contoh: Kunjungi Website Resmi Dancell"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-700">Alamat URL Web</label>
                                    <input
                                        type="text"
                                        value={linkUrl}
                                        onChange={(e) => setLinkUrl(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleSaveLink(e);
                                            }
                                        }}
                                        placeholder="https://dancell.id atau https://..."
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all"
                                        autoFocus
                                    />
                                </div>

                                <div className="pt-2 flex items-center justify-between gap-2">
                                    {editor.isActive('link') ? (
                                        <button
                                            type="button"
                                            onClick={handleRemoveLink}
                                            className="px-3.5 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-medium transition-colors cursor-pointer"
                                        >
                                            Hapus Link
                                        </button>
                                    ) : <div />}

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setLinkModalOpen(false);
                                            }}
                                            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSaveLink}
                                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#800020] hover:bg-[#600018] text-white text-xs font-medium transition-all shadow-xs cursor-pointer"
                                        >
                                            <Check className="w-3.5 h-3.5" />
                                            <span>Terapkan Link</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               Custom Modern Image URL Modal (Pure Div, No Nested Form)
               ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <AnimatePresence>
                {imgModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setImgModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="relative bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-5"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#800020] flex items-center justify-center">
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                                            Sisipkan Gambar via URL
                                        </h3>
                                        <p className="text-[11px] text-slate-500 font-light">
                                            Masukkan alamat link gambar online
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setImgModalOpen(false);
                                    }}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-700">URL Link Gambar</label>
                                    <input
                                        type="text"
                                        value={imgUrl}
                                        onChange={(e) => {
                                            setImgUrl(e.target.value);
                                            setImgLoadError(false);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleSaveImageUrl(e);
                                            }
                                        }}
                                        placeholder="https://images.unsplash.com/... atau https://..."
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all"
                                        autoFocus
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-700">Keterangan / Alt Text (Opsional)</label>
                                    <input
                                        type="text"
                                        value={imgAlt}
                                        onChange={(e) => setImgAlt(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleSaveImageUrl(e);
                                            }
                                        }}
                                        placeholder="Deskripsi gambar..."
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all"
                                    />
                                </div>

                                {/* Live Image Preview */}
                                {imgUrl.trim() && (
                                    <div className="space-y-1">
                                        <span className="text-[11px] text-slate-400 font-light">Pratinjau Gambar:</span>
                                        {imgLoadError ? (
                                            <div className="aspect-[16/9] rounded-2xl bg-rose-50 border border-rose-200 flex flex-col items-center justify-center p-4 text-center">
                                                <AlertCircle className="w-6 h-6 text-rose-500 mb-1" />
                                                <span className="text-xs font-medium text-rose-700">Gagal memuat pratinjau URL</span>
                                                <span className="text-[10px] text-rose-500 font-light">Periksa kembali apakah link gambar valid & dapat diakses publik</span>
                                            </div>
                                        ) : (
                                            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
                                                <img
                                                    src={imgUrl.trim()}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={() => setImgLoadError(true)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="pt-2 flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setImgModalOpen(false);
                                        }}
                                        className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="button"
                                        disabled={!imgUrl.trim()}
                                        onClick={handleSaveImageUrl}
                                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#800020] hover:bg-[#600018] text-white text-xs font-medium transition-all shadow-xs cursor-pointer disabled:opacity-50"
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Sisipkan Gambar</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
