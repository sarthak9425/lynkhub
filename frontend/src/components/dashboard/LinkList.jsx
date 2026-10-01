import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SpotlightCard from '../common/SpotlightCard';
import QRCodeModal from './QRCodeModal';
import { Search, Copy, Check, QrCode, Trash2, ExternalLink, MousePointerClick, Calendar, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

const LinkList = ({ refreshTrigger, onLinkDeleted }) => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalLinks: 0 });
  const [copiedId, setCopiedId] = useState(null);
  const [selectedQrLink, setSelectedQrLink] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/links?page=${page}&limit=6&search=${encodeURIComponent(search)}`);
      if (res.data.success) {
        setLinks(res.data.links);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching links:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [page, search, refreshTrigger]);

  const handleCopy = (id, slug) => {
    const fullUrl = `${window.location.origin}/r/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/links/${id}`);
      if (res.data.success) {
        setDeleteConfirmId(null);
        fetchLinks();
        if (onLinkDeleted) onLinkDeleted();
      }
    } catch (err) {
      console.error('Error deleting link:', err);
    }
  };

  const domain = window.location.origin;

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg font-bold text-slate-900 tracking-tight">Active Short Links</h3>
          <p className="text-xs text-slate-500 font-medium">
            Total {pagination.totalLinks} links registered
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search slug or URL..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Links List */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500 font-medium">
          <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
          <span className="text-xs">Loading active links...</span>
        </div>
      ) : links.length === 0 ? (
        <SpotlightCard className="p-8 text-center text-slate-500 border-slate-200/80 shadow-corporate-card">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-900">No short links found</p>
          <p className="text-xs mt-1">Shorten a URL using the form above to start tracking clicks!</p>
        </SpotlightCard>
      ) : (
        <div className="space-y-3">
          {links.map((link) => (
            <SpotlightCard key={link._id} className="p-4 md:p-5 border-slate-200/80 shadow-corporate-card">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left Link Info */}
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={`${domain}/r/${link.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors group"
                    >
                      {domain}/r/{link.slug}
                      <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                    </a>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                      /{link.slug}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 truncate max-w-xl" title={link.longUrl}>
                    Target: <span className="text-slate-800 font-mono">{link.longUrl}</span>
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium pt-1">
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <MousePointerClick className="w-3.5 h-3.5" />
                      {link.clicksCount || 0} clicks
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(link.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopy(link._id, link.slug)}
                    className="px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-all text-xs font-semibold flex items-center gap-1.5"
                    title="Copy Short URL"
                  >
                    {copiedId === link._id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="hidden sm:inline text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedQrLink(link)}
                    className="px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 hover:text-violet-600 hover:border-violet-300 transition-all text-xs font-semibold flex items-center gap-1.5"
                    title="Generate QR Code"
                  >
                    <QrCode className="w-3.5 h-3.5 text-violet-600" />
                    <span className="hidden sm:inline">QR Code</span>
                  </button>

                  {deleteConfirmId === link._id ? (
                    <div className="flex items-center gap-1.5 animate-fadeIn">
                      <button
                        onClick={() => handleDelete(link._id)}
                        className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-xs hover:bg-slate-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(link._id)}
                      className="p-2 rounded-full bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-all text-xs"
                      title="Delete Link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-medium text-slate-500">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {selectedQrLink && (
        <QRCodeModal
          link={selectedQrLink}
          onClose={() => setSelectedQrLink(null)}
        />
      )}
    </div>
  );
};

export default LinkList;
