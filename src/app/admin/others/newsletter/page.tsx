"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { getNewsletterSubscribers, deleteSubscriber, Subscriber } from "@/app/actions/newsletter";
import { Loader2, ArrowLeft, Trash2, Mail, Download } from "lucide-react";
import Link from "next/link";

export default function NewsletterPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/admin/login");
        }
    }, [authLoading, user, router]);

    useEffect(() => {
        if (user) {
            loadSubscribers();
        }
    }, [user]);

    const loadSubscribers = async () => {
        setLoading(true);
        try {
            const data = await getNewsletterSubscribers();
            setSubscribers(data);
        } catch (error) {
            console.error("Failed to load subscribers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this subscriber?")) return;

        setDeleting(id);
        const result = await deleteSubscriber(id);

        if (result.success) {
            setSubscribers(prev => prev.filter(s => s.id !== id));
        } else {
            alert("Failed to delete: " + result.error);
        }
        setDeleting(null);
    };

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Email,Status,Subscribed At\n"
            + subscribers.map(s => `${s.email},${s.status},${new Date(s.subscribedAt).toISOString()}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "newsletter_subscribers.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/admin" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Mail className="w-6 h-6 text-amber-600" />
                            Newsletter Subscribers
                        </h1>
                        <p className="text-gray-500">View and manage list of subscribed emails</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <span className="font-semibold text-gray-700">Total Subscribers: {subscribers.length}</span>
                        <button
                            onClick={handleExport}
                            disabled={subscribers.length === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center">
                            <Loader2 className="w-8 h-8 animate-spin text-amber-600 mx-auto" />
                        </div>
                    ) : subscribers.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p>No subscribers yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-600 font-medium">
                                    <tr>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {subscribers.map((subscriber) => (
                                        <tr key={subscriber.id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-3 font-medium text-gray-900">{subscriber.email}</td>
                                            <td className="px-6 py-3">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${subscriber.status === 'subscribed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {subscriber.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-gray-500">
                                                {new Date(subscriber.subscribedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <button
                                                    onClick={() => handleDelete(subscriber.id)}
                                                    disabled={deleting === subscriber.id}
                                                    className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors disabled:opacity-30"
                                                    title="Delete"
                                                >
                                                    {deleting === subscriber.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
