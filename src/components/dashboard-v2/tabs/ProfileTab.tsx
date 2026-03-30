import { User, Mail, Phone, MapPin, Camera, LogOut, FileText, Shield, Bell, Upload, RefreshCw, Trash2, Euro, Settings, Lock, Eye, EyeOff, Smartphone, Download, ChevronRight, CreditCard, Home } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useWalkerProfile } from "@/hooks/useProfile";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import avatarWalker from "@/assets/avatar-walker.jpg";
import { mockProfile } from "@/data/demoData";
import { Switch } from "@/components/ui/switch";

const ProfileTab = ({ role }: { role: "owner" | "walker" }) => {
  const { user } = useAuth();
  const { data: realProfile } = useProfile();
  const { data: walkerProfile } = useWalkerProfile(user?.id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isDemo = !user;
  const profile = isDemo ? mockProfile : realProfile;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Walker pricing state
  const [hourlyRate, setHourlyRate] = useState(15);
  const [maxDogs, setMaxDogs] = useState(3);
  const [serviceRadius, setServiceRadius] = useState(5);
  const [savingPricing, setSavingPricing] = useState(false);

  // Notification prefs
  const [notifs, setNotifs] = useState({
    push: true, email: true, sms: false,
    bookings: true, messages: true, reviews: true, promos: false,
  });

  // Privacy
  const [privacy, setPrivacy] = useState({
    profileVisible: true, showCity: true, showPhone: false,
  });

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setPhone(profile.phone || "");
      setCity(profile.city || "");
      setBio(profile.bio || "");
      setAddress((profile as any).address || "");
    }
  }, [profile]);

  useEffect(() => {
    if (walkerProfile) {
      setHourlyRate(walkerProfile.hourly_rate || 15);
      setMaxDogs(walkerProfile.max_dogs || 3);
      setServiceRadius(walkerProfile.service_radius_km || 5);
    }
  }, [walkerProfile]);

  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({
      first_name: firstName, last_name: lastName, phone, city, bio,
      updated_at: new Date().toISOString()
    }).eq("id", user.id);
    if (error) { toast.error("Erreur de sauvegarde"); return; }
    toast.success("Profil mis à jour !");
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    setEditing(false);
  };

  const handleSavePricing = async () => {
    if (!user) return;
    setSavingPricing(true);
    const { error } = await supabase.from("walker_profiles").update({
      hourly_rate: hourlyRate,
      max_dogs: maxDogs,
      service_radius_km: serviceRadius,
      updated_at: new Date().toISOString()
    }).eq("user_id", user.id);
    if (error) toast.error("Erreur");
    else {
      toast.success("Tarifs enregistrés !");
      queryClient.invalidateQueries({ queryKey: ["walker_profile"] });
    }
    setSavingPricing(false);
    setActiveSection(null);
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    if (!file.type.startsWith('image/')) { toast.error("Format non supporté"); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error("Image trop volumineuse (max 2MB)"); return; }
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar_${Date.now()}.${fileExt}`;
      if (profile?.avatar_url) {
        const oldPath = profile.avatar_url.split('/avatars/')[1];
        if (oldPath) await supabase.storage.from('avatars').remove([oldPath]);
      }
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file, { cacheControl: '3600', upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      await supabase.from('profiles').update({ avatar_url: urlData.publicUrl, updated_at: new Date().toISOString() }).eq('id', user.id);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Photo mise à jour !");
    } catch (error: any) { toast.error(error.message); }
    finally { setUploading(false); }
  };

  const handleRemoveAvatar = async () => {
    if (!user || !profile?.avatar_url) return;
    setUploading(true);
    try {
      const oldPath = profile.avatar_url.split('/avatars/')[1];
      if (oldPath) await supabase.storage.from('avatars').remove([oldPath]);
      await supabase.from('profiles').update({ avatar_url: null, updated_at: new Date().toISOString() }).eq('id', user.id);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Photo supprimée");
    } catch (error: any) { toast.error(error.message); }
    finally { setUploading(false); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const commission = 0.13;
  const netRate = hourlyRate * (1 - commission);

  const serviceEstimates = [
    { label: "Promenade (1h)", price: hourlyRate },
    { label: "Visite à domicile", price: Math.round(hourlyRate * 0.8) },
    { label: "Garde journée", price: Math.round(hourlyRate * 3) },
    { label: "Accompagnement véto", price: Math.round(hourlyRate * 1.5) },
  ];

  return (
    <div className="px-4 py-6 space-y-3 pb-24">
      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl shadow-card p-5 text-center">
        <div className="relative inline-block mb-3 group">
          <img src={profile?.avatar_url || avatarWalker} alt="Avatar"
            className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/20 mx-auto transition-transform group-hover:scale-105" />
          {uploading ? (
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center mx-auto w-20 h-20">
              <RefreshCw className="w-5 h-5 text-white animate-spin" />
            </div>
          ) : (
            <button onClick={() => !isDemo && fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full gradient-primary flex items-center justify-center border-2 border-card shadow-lg hover:scale-110 transition-transform">
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          )}
        </div>
        {profile?.avatar_url && !isDemo && (
          <button onClick={handleRemoveAvatar} className="text-[10px] text-destructive font-medium flex items-center gap-1 mx-auto mb-1">
            <Trash2 className="w-3 h-3" /> Supprimer
          </button>
        )}
        <h2 className="text-lg font-black text-foreground">{profile?.first_name || "Utilisateur"} {profile?.last_name || ""}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{profile?.email}</p>
        <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">
          {role === "walker" ? "🏃 Promeneur" : "🐕 Propriétaire"}
        </span>
      </motion.div>

      <input type="file" ref={fileInputRef} accept="image/jpeg,image/png,image/webp" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAvatarUpload(f); e.target.value = ''; }} />

      {/* Personal Info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-card rounded-2xl shadow-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground text-sm">👤 Informations personnelles</h3>
          {!isDemo && (
            <button onClick={() => editing ? handleSave() : setEditing(true)}
              className="text-xs font-bold text-primary">
              {editing ? "💾 Sauvegarder" : "✏️ Modifier"}
            </button>
          )}
        </div>
        {[
          { icon: User, label: "Prénom", value: firstName, set: setFirstName },
          { icon: User, label: "Nom", value: lastName, set: setLastName },
          { icon: Phone, label: "Téléphone", value: phone, set: setPhone, placeholder: "06 12 34 56 78" },
          { icon: MapPin, label: "Ville", value: city, set: setCity, placeholder: "Paris, Lyon..." },
          { icon: Home, label: "Adresse", value: address, set: setAddress, placeholder: "12 rue de la Paix" },
        ].map((field) => (
          <div key={field.label} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
              <field.icon className="w-4 h-4 text-primary" />
            </div>
            {editing ? (
              <input value={field.value} onChange={e => field.set(e.target.value)}
                placeholder={field.placeholder || field.label}
                className="flex-1 px-3 py-2 rounded-xl bg-muted text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            ) : (
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground">{field.label}</p>
                <p className="text-sm font-semibold text-foreground">{field.value || "—"}</p>
              </div>
            )}
          </div>
        ))}
        {editing && (
          <div className="space-y-2">
            <label className="text-[10px] text-muted-foreground font-semibold">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Parlez de vous..."
              maxLength={500}
              className="w-full px-3 py-2 rounded-xl bg-muted text-sm text-foreground min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            <p className="text-[9px] text-muted-foreground text-right">{bio.length}/500</p>
          </div>
        )}
        {!editing && bio && (
          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-[10px] text-muted-foreground mb-1">Bio</p>
            <p className="text-sm text-foreground leading-relaxed">{bio}</p>
          </div>
        )}
      </motion.div>

      {/* === WALKER ONLY: Pricing Section === */}
      {role === "walker" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-card overflow-hidden">
          <button onClick={() => setActiveSection(activeSection === "pricing" ? null : "pricing")}
            className="w-full p-4 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Euro className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Mes Tarifs</p>
                <p className="text-[10px] text-muted-foreground">
                  {hourlyRate}€/h · Net {netRate.toFixed(0)}€/h · Rayon {serviceRadius}km
                </p>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${activeSection === "pricing" ? "rotate-90" : ""}`} />
          </button>
          {activeSection === "pricing" && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              className="px-4 pb-4 space-y-4 border-t border-border/50">

              {/* Hourly rate */}
              <div className="pt-3 space-y-2">
                <label className="text-xs font-bold text-muted-foreground">Tarif horaire</label>
                <div className="flex items-center gap-3">
                  <input type="range" min={8} max={50} value={hourlyRate}
                    onChange={e => setHourlyRate(Number(e.target.value))}
                    className="flex-1 accent-[hsl(var(--primary))]" />
                  <span className="text-lg font-black text-foreground w-14 text-right">{hourlyRate}€</span>
                </div>
                <div className="flex items-center justify-between bg-primary/5 rounded-xl px-3 py-2">
                  <span className="text-[10px] text-muted-foreground">Vous recevez (après 13%)</span>
                  <span className="text-sm font-black text-primary">{netRate.toFixed(2)}€/h</span>
                </div>
              </div>

              {/* Max dogs */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">Chiens simultanés max</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => setMaxDogs(n)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        maxDogs === n ? "gradient-primary text-white shadow-card" : "bg-muted text-muted-foreground"
                      }`}>{n}</button>
                  ))}
                </div>
              </div>

              {/* Service radius */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">Rayon d'intervention</label>
                <div className="flex items-center gap-3">
                  <input type="range" min={1} max={25} value={serviceRadius}
                    onChange={e => setServiceRadius(Number(e.target.value))}
                    className="flex-1 accent-[hsl(var(--primary))]" />
                  <span className="text-sm font-black text-foreground w-12 text-right">{serviceRadius}km</span>
                </div>
              </div>

              {/* Service estimates */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Tarifs estimés par service</label>
                {serviceEstimates.map(s => (
                  <div key={s.label} className="flex items-center justify-between bg-muted/50 rounded-xl px-3 py-2">
                    <span className="text-xs text-foreground">{s.label}</span>
                    <span className="text-xs font-bold text-foreground">{s.price}€</span>
                  </div>
                ))}
              </div>

              <button onClick={handleSavePricing} disabled={savingPricing}
                className="w-full py-2.5 rounded-xl gradient-primary text-white text-sm font-bold disabled:opacity-50">
                {savingPricing ? "Enregistrement..." : "💾 Enregistrer les tarifs"}
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* === WALKER ONLY: Documents Section === */}
      {role === "walker" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="bg-card rounded-2xl shadow-card overflow-hidden">
          <button onClick={() => setActiveSection(activeSection === "documents" ? null : "documents")}
            className="w-full p-4 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Mes Documents</p>
                <p className="text-[10px] text-muted-foreground">CNI, Casier B2, Assurance RC Pro</p>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${activeSection === "documents" ? "rotate-90" : ""}`} />
          </button>
          {activeSection === "documents" && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              className="px-4 pb-4 space-y-2 border-t border-border/50 pt-3">
              {[
                { label: "Carte d'identité", status: walkerProfile?.verified ? "verified" : "pending", icon: "🪪", type: "cni" },
                { label: "Casier judiciaire B2", status: "pending", icon: "📋", type: "casier_b2" },
                { label: "Assurance RC Pro", status: "pending", icon: "🛡️", type: "assurance_rc" },
              ].map(doc => (
                <div key={doc.label} className="flex items-center justify-between bg-muted/50 rounded-xl px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{doc.icon}</span>
                    <span className="text-xs font-semibold text-foreground">{doc.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      doc.status === "verified" ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-600"
                    }`}>
                      {doc.status === "verified" ? "✓ Vérifié" : "⏳ À envoyer"}
                    </span>
                    <label className="text-[10px] font-bold text-primary cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <input type="file" accept="image/*,application/pdf" className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file || !user) return;
                          if (file.size > 10 * 1024 * 1024) { toast.error("Max 10MB"); return; }
                          try {
                            const ext = file.name.split('.').pop();
                            const path = `${user.id}/${doc.type}_${Date.now()}.${ext}`;
                            const { error: uploadErr } = await supabase.storage.from('walker-documents').upload(path, file, { upsert: true });
                            if (uploadErr) throw uploadErr;
                            const { data: urlData } = supabase.storage.from('walker-documents').getPublicUrl(path);
                            await supabase.from('walker_documents').upsert({
                              walker_id: user.id,
                              document_type: doc.type,
                              file_url: urlData.publicUrl,
                              verification_status: 'pending',
                              submitted_at: new Date().toISOString(),
                            }, { onConflict: 'walker_id,document_type' as any });
                            toast.success(`${doc.label} envoyé ! Vérification sous 24-48h.`);
                          } catch (err: any) { toast.error(err.message || "Erreur d'envoi"); }
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>
                </div>
              ))}
              <p className="text-[9px] text-muted-foreground text-center pt-1">
                Les documents sont vérifiés sous 24-48h par notre équipe
              </p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* === OWNER ONLY: Payment Methods === */}
      {role === "owner" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-card overflow-hidden">
          <button onClick={() => setActiveSection(activeSection === "payment" ? null : "payment")}
            className="w-full p-4 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Moyens de paiement</p>
                <p className="text-[10px] text-muted-foreground">Gérer vos cartes et modes de paiement</p>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${activeSection === "payment" ? "rotate-90" : ""}`} />
          </button>
          {activeSection === "payment" && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              className="px-4 pb-4 border-t border-border/50 pt-3">
              <div className="bg-muted/50 rounded-xl p-4 text-center space-y-2">
                <CreditCard className="w-8 h-8 text-muted-foreground/30 mx-auto" />
                <p className="text-xs font-semibold text-muted-foreground">Paiement sécurisé par Stripe</p>
                <p className="text-[10px] text-muted-foreground">La carte sera demandée lors de votre première réservation</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-card rounded-2xl shadow-card overflow-hidden">
        <button onClick={() => setActiveSection(activeSection === "notifs" ? null : "notifs")}
          className="w-full p-4 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
              <Bell className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Notifications</p>
              <p className="text-[10px] text-muted-foreground">Push, email, SMS</p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${activeSection === "notifs" ? "rotate-90" : ""}`} />
        </button>
        {activeSection === "notifs" && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            className="px-4 pb-4 space-y-2 border-t border-border/50 pt-3">
            {[
              { key: "push", label: "Notifications push", icon: Smartphone },
              { key: "email", label: "Notifications email", icon: Mail },
              { key: "bookings", label: "Rappels réservation", icon: Bell },
              { key: "messages", label: "Nouveaux messages", icon: Mail },
              { key: "reviews", label: "Avis reçus", icon: Bell },
              { key: "promos", label: "Offres & promotions", icon: Bell },
            ].map(n => (
              <div key={n.key} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <n.icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-foreground">{n.label}</span>
                </div>
                <Switch checked={(notifs as any)[n.key]}
                  onCheckedChange={(v) => setNotifs({ ...notifs, [n.key]: v })} />
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Privacy & Security */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
        className="bg-card rounded-2xl shadow-card overflow-hidden">
        <button onClick={() => setActiveSection(activeSection === "privacy" ? null : "privacy")}
          className="w-full p-4 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
              <Shield className="w-4 h-4 text-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Confidentialité & Sécurité</p>
              <p className="text-[10px] text-muted-foreground">Visibilité, mot de passe</p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${activeSection === "privacy" ? "rotate-90" : ""}`} />
        </button>
        {activeSection === "privacy" && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            className="px-4 pb-4 space-y-3 border-t border-border/50 pt-3">
            {[
              { key: "profileVisible", label: role === "walker" ? "Apparaître dans les recherches" : "Profil visible par les promeneurs" },
              { key: "showCity", label: "Afficher ma ville" },
              { key: "showPhone", label: "Afficher mon téléphone (après réservation)" },
            ].map(p => (
              <div key={p.key} className="flex items-center justify-between py-1">
                <span className="text-xs text-foreground">{p.label}</span>
                <Switch checked={(privacy as any)[p.key]}
                  onCheckedChange={(v) => setPrivacy({ ...privacy, [p.key]: v })} />
              </div>
            ))}
            <div className="border-t border-border/50 pt-3 space-y-2">
              <button onClick={async () => {
                if (!user) return;
                const { error } = await supabase.auth.resetPasswordForEmail(profile?.email || user.email || "", {
                  redirectTo: window.location.origin + "/auth",
                });
                if (error) toast.error("Erreur : " + error.message);
                else toast.success("Email de réinitialisation envoyé !");
              }} className="w-full flex items-center gap-3 py-2 text-left">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground">Changer le mot de passe</span>
              </button>
              <button onClick={() => {
                toast.success("Fonctionnalité bientôt disponible");
              }} className="w-full flex items-center gap-3 py-2 text-left">
                <Download className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground">Exporter mes données</span>
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Quick Links */}
      <div className="space-y-2">
        {role === "walker" && (
          <>
            <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              onClick={() => navigate("/walker/dashboard?tab=formation")}
              className="w-full bg-card rounded-2xl shadow-card p-3.5 flex items-center gap-3 text-left hover:shadow-card-hover transition-shadow">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="text-sm">🎓</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">Formation & Quiz</p>
                <p className="text-[10px] text-muted-foreground">Améliorez vos compétences</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.button>
            <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 }}
              onClick={() => navigate("/walker/dashboard?tab=factures")}
              className="w-full bg-card rounded-2xl shadow-card p-3.5 flex items-center gap-3 text-left hover:shadow-card-hover transition-shadow">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                <FileText className="w-4 h-4 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">Mes Factures</p>
                <p className="text-[10px] text-muted-foreground">Historique des paiements</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          </>
        )}
        {role === "owner" && (
          <>
            <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              onClick={() => navigate("/dashboard?tab=parrainage")}
              className="w-full bg-card rounded-2xl shadow-card p-3.5 flex items-center gap-3 text-left hover:shadow-card-hover transition-shadow">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                <span className="text-sm">🎁</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">Parrainage</p>
                <p className="text-[10px] text-muted-foreground">15€ pour vous, 10€ pour votre filleul</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.button>
            <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 }}
              onClick={() => navigate("/dashboard?tab=avis")}
              className="w-full bg-card rounded-2xl shadow-card p-3.5 flex items-center gap-3 text-left hover:shadow-card-hover transition-shadow">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                <span className="text-sm">⭐</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">Mes Avis</p>
                <p className="text-[10px] text-muted-foreground">Consultez vos évaluations</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          </>
        )}
      </div>

      {/* Help */}
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        onClick={() => navigate("/aide")}
        className="w-full bg-card rounded-2xl shadow-card p-3.5 flex items-center gap-3 text-left hover:shadow-card-hover transition-shadow">
        <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
          <span className="text-sm">❓</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">Aide & Support</p>
          <p className="text-[10px] text-muted-foreground">FAQ, contact, signaler un problème</p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </motion.button>

      {/* Logout */}
      <motion.button whileTap={{ scale: 0.97 }} onClick={handleLogout}
        className="w-full py-3.5 rounded-2xl border border-destructive/20 text-destructive font-bold text-sm flex items-center justify-center gap-2 hover:bg-destructive/5 transition-colors">
        <LogOut className="w-4 h-4" /> Se déconnecter
      </motion.button>
    </div>
  );
};

export default ProfileTab;
