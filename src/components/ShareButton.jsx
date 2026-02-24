import React, { useState, useEffect } from "react";

// WhatsApp SVG icon
const WhatsAppIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

// Native share icon
const ShareIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
        />
    </svg>
);

// Download icon
const DownloadIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
    </svg>
);

// Spinner
const Spinner = () => (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
);

export default function ShareButton({ shareUrl, shareText, captureRef, captureTitle }) {
    const [canShare, setCanShare] = useState(false);
    const [capturing, setCapturing] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const [shared, setShared] = useState(false);

    useEffect(() => {
        setCanShare(typeof navigator !== "undefined" && !!navigator.share);
    }, []);

    // ── Native text share ─────────────────────────────────────────────────────
    const handleNativeShare = async () => {
        try {
            await navigator.share({
                title: "Horario de Asesorías — Quédate en Colmayor",
                text: shareText,
                url: shareUrl,
            });
            setShared(true);
            setTimeout(() => setShared(false), 2000);
        } catch {
            // User cancelled — silently ignore
        }
    };

    // ── Image download ────────────────────────────────────────────────────────
    // navigator.share({ files }) requires the user gesture to remain active
    // through the entire async chain — this is lost after html2canvas finishes.
    // Programmatic download via <a download> is async-safe and works on all devices.
    const handleImageDownload = async () => {
        if (!captureRef?.current) return;
        setCapturing(true);

        // Build filename before async work
        const slug = (captureTitle || 'horario')
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const filename = `horario-${slug}.png`;

        // Temporarily insert branded header into the REAL DOM node so styles are intact
        const header = document.createElement('div');
        header.id = '__share-export-header__';
        header.style.cssText = 'padding:20px 24px 16px;border-bottom:2px solid #e2e8f0;margin-bottom:16px;background:#ffffff;font-family:Inter,system-ui,sans-serif;';
        header.innerHTML = `
            <h1 style="margin:0 0 4px;font-size:20px;font-weight:700;color:#0f172a;line-height:1.2;">Quédate en Colmayor</h1>
            <p style="margin:0 0 10px;font-size:12px;color:#64748b;">Ingreso, Permanencia y Graduación</p>
            <h2 style="margin:0;font-size:14px;font-weight:600;color:#1d4ed8;">Horario de Asesorías — ${captureTitle || 'Todos los días'}</h2>
        `;
        captureRef.current.insertBefore(header, captureRef.current.firstChild);

        try {
            const { toPng } = await import("html-to-image");

            const dataUrl = await toPng(captureRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: '#ffffff',
            });

            // Remove header from real DOM immediately after capture
            const inserted = captureRef.current.querySelector('#__share-export-header__');
            if (inserted) captureRef.current.removeChild(inserted);

            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            setDownloaded(true);
            setTimeout(() => setDownloaded(false), 3000);
        } catch (err) {
            // Always clean up header even on failure
            const inserted = captureRef.current?.querySelector('#__share-export-header__');
            if (inserted) captureRef.current.removeChild(inserted);
            console.warn('Image download failed:', err);
        } finally {
            setCapturing(false);
        }
    };

    // ── WhatsApp deep link ────────────────────────────────────────────────────
    const whatsappMessage = encodeURIComponent(`${shareText}\n${shareUrl}`);
    const whatsappHref = `https://wa.me/?text=${whatsappMessage}`;

    return (
        <div className="flex items-center gap-2">
            {/* Native text share — mobile only */}
            {canShare && (
                <button
                    onClick={handleNativeShare}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-xs font-semibold"
                    title="Compartir horario"
                >
                    <ShareIcon />
                    <span>{shared ? "¡Listo!" : "Compartir"}</span>
                </button>
            )}

            {/* Image download — always visible when captureRef is set */}
            {captureRef && (
                <button
                    onClick={handleImageDownload}
                    disabled={capturing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors text-xs font-semibold disabled:opacity-60"
                    title="Descargar imagen del horario"
                >
                    {capturing ? <Spinner /> : <DownloadIcon />}
                    <span>
                        {capturing ? "Capturando..." : downloaded ? "¡Listo!" : "Imagen"}
                    </span>
                </button>
            )}

            {/* WhatsApp — always visible */}
            <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors text-xs font-semibold"
                title="Compartir por WhatsApp"
            >
                <WhatsAppIcon />
                <span>WhatsApp</span>
            </a>
        </div>
    );
}
