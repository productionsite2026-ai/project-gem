import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, MapPin, MessageCircle, Phone, Star, RefreshCw, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings, useUpdateBooking } from "@/hooks/useNewBookings";
import { mockBookings } from "@/data/demoData";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Filter = "all" | "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";

const statusConfig: Record<string, { label: string; icon: any; className: string }> = {
  pending: { label: "En attente", icon: AlertCircle, className: "bg-amber-500/12 text-amber-600" },
  confirmed: { label: "Confirmée", icon: CheckCircle, className: "bg-primary/12 text-primary" },
  in_progress: { label: "En cours", icon: Navigation, className: "bg-accent/12 text-accent" },
  completed: { label: "Terminée", icon: CheckCircle, className: "bg-primary/12 text-primary" },
  cancelled: { label: "Annulée", icon: XCircle, className: "bg-destructive/12 text-destructive" },
};

const BookingsTab = ({ role }: { role: "owner" | "walker" }) => {
  const { user } = useAuth();
  const { data: realBookings = [] } = useBookings(role);
  const updateBooking = useUpdateBooking();
  const navigate = useNavigate();
  const isDemo = !user;
  const bookings = isDemo ? mockBookings : realBookings;
  const [filter, setFilter] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "Toutes", count: bookings.length },
    { key: "pending", label: "En attente", count: bookings.filter((b: any) => b.status === "pending").length },
    { key: "confirmed", label: "Confirmées", count: bookings.filter((b: any) => b.status === "confirmed").length },
    { key: "in_progress", label: "En cours", count: bookings.filter((b: any) => b.status === "in_progress").length },
    { key: "completed", label: "Terminées", count: bookings.filter((b: any) => b.status === "completed").length },
  ];

  const filtered = filter === "all" ? bookings : bookings.filter((b: any) => b.status === filter);

  const handleConfirm = async (bookingId: string) => {
    if (isDemo) return;
    try {
      const updates = role === "walker"
        ? { id: bookingId, walker_confirmed: true, status: "confirmed" as const }
        : { id: bookingId, owner_confirmed: true };
      await updateBooking.mutateAsync(updates);
      toast.success("Réservation confirmée !");
    } catch { toast.error("Erreur"); }
  };

  const handleCancel = async (bookingId: string) => {
    if (isDemo) return;
    try {
      await updateBooking.mutateAsync({ id: bookingId, status: "cancelled" as const, cancelled_by: user!.id });
      toast.success("Réservation annulée");
    } catch { toast.error("Erreur"); }
  };

  // Aggregate stats
  const totalBookings = bookings.length;
  const completedCount = bookings.filter((b: any) => b.status === "completed").length;
  const totalSpent = bookings.filter((b: any) => b.status === "completed").reduce((s: number, b: any) => s + Number(b.price || 0), 0);

  return (
    <div className="px-4 py-6 space-y-4 pb-24">
      <div className="flex items-center gap-2 mb-1">
        <Calendar className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-black text-foreground">
          {role === "walker" ? "Mes Missions" : "Mes Réservations"}
        </h2>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl shadow-card p-3 text-center">
          <span className="text-lg font-black text-foreground">{totalBookings}</span>
          <p className="text-[9px] text-muted-foreground font-semibold">Total</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
          className="bg-card rounded-xl shadow-card p-3 text-center">
          <span className="text-lg font-black text-primary">{completedCount}</span>
          <p className="text-[9px] text-muted-foreground font-semibold">Terminées</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="bg-card rounded-xl shadow-card p-3 text-center">
          <span className="text-lg font-black text-foreground">{totalSpent.toFixed(0)}€</span>
          <p className="text-[9px] text-muted-foreground font-semibold">{role === "walker" ? "Gagné" : "Dépensé"}</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {filters.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
              filter === f.key ? "gradient-primary text-white shadow-card" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}>
            {f.label} {f.count > 0 && <span className="ml-0.5 opacity-80">({f.count})</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm font-semibold text-muted-foreground">
            {filter === "all" ? "Aucune réservation" : `Aucune réservation ${filters.find(f => f.key === filter)?.label.toLowerCase()}`}
          </p>
          {role === "owner" && filter === "all" && (
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/find-walkers")}
              className="mt-3 px-4 py-2 rounded-full gradient-primary text-white text-xs font-bold">
              🐕 Réserver une Promenade
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b: any, i: number) => {
            const st = statusConfig[b.status] || statusConfig.pending;
            const Icon = st.icon;
            const isExpanded = expandedId === b.id;
            return (
              <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card rounded-2xl shadow-card overflow-hidden">
                <button className="w-full p-4 text-left" onClick={() => setExpandedId(isExpanded ? null : b.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Dog photo or icon */}
                      <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0 overflow-hidden">
                        {(b.dogs?.photo_url) ? (
                          <img src={b.dogs.photo_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Calendar className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-foreground">🐕 {b.dogs?.name || b.dogName || "Chien"}</span>
                        <p className="text-[10px] text-muted-foreground capitalize">{b.service_type || b.service || "Promenade"}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${st.className}`}>
                      <Icon className="w-3 h-3" /> {st.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground bg-muted/50 rounded-xl px-3 py-2 mt-2">
                    <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {b.scheduled_date || b.date}</div>
                    <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {b.scheduled_time || b.time}</div>
                    {b.duration_minutes && <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {b.duration_minutes}min</div>}
                    {(b.price || b.price === 0) && <span className="font-bold text-foreground ml-auto">{b.price}€</span>}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <div className="px-4 pb-4 space-y-2">
                        {b.address && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" /> {b.address}{b.city ? `, ${b.city}` : ""}
                          </div>
                        )}
                        {b.notes && (
                          <p className="text-xs text-muted-foreground bg-muted/50 rounded-xl px-3 py-2">📝 {b.notes}</p>
                        )}

                        {/* Walker/Owner info */}
                        {role === "owner" && b.walker_id && (
                          <div className="flex items-center gap-2 bg-primary/5 rounded-xl px-3 py-2">
                            <span className="text-xs text-foreground font-semibold">🏃 Promeneur assigné</span>
                            <button onClick={() => navigate(`/messages?user=${b.walker_id}`)}
                              className="ml-auto text-[10px] text-primary font-bold flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" /> Contacter
                            </button>
                          </div>
                        )}

                        <div className="flex gap-2 pt-1">
                          {b.status === "pending" && (
                            <>
                              <button onClick={() => handleConfirm(b.id)}
                                className="flex-1 py-2 rounded-xl gradient-primary text-white text-xs font-bold">
                                ✓ Confirmer
                              </button>
                              <button onClick={() => handleCancel(b.id)}
                                className="flex-1 py-2 rounded-xl border border-destructive/20 text-destructive text-xs font-bold">
                                ✕ Annuler
                              </button>
                            </>
                          )}
                          {b.status === "confirmed" && (
                            <>
                              <button onClick={() => navigate(`/messages`)}
                                className="flex-1 py-2 rounded-xl bg-accent/10 text-accent text-xs font-bold flex items-center justify-center gap-1">
                                <MessageCircle className="w-3 h-3" /> Contacter
                              </button>
                              <button onClick={() => handleCancel(b.id)}
                                className="py-2 px-3 rounded-xl border border-destructive/20 text-destructive text-xs font-bold">
                                Annuler
                              </button>
                            </>
                          )}
                          {b.status === "completed" && role === "owner" && (
                            <button className="flex-1 py-2 rounded-xl bg-amber-500/10 text-amber-600 text-xs font-bold flex items-center justify-center gap-1">
                              <Star className="w-3 h-3" /> Laisser un avis
                            </button>
                          )}
                          {b.status === "completed" && role === "owner" && (
                            <button onClick={() => navigate("/find-walkers")}
                              className="flex-1 py-2 rounded-xl gradient-primary text-white text-xs font-bold flex items-center justify-center gap-1">
                              <RefreshCw className="w-3 h-3" /> Re-réserver
                            </button>
                          )}
                          {b.status === "cancelled" && (
                            <p className="text-xs text-muted-foreground italic">
                              {b.cancellation_reason || "Annulée par l'utilisateur"}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingsTab;
