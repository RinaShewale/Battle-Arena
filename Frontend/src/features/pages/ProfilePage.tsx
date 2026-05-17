import React, {
  useEffect,
  useState,
} from "react";

import { useAuth } from "../../auth/AuthContext";

import {
  Settings,
  ChevronLeft,
  Pencil,
  Mail,
  User,
  TextQuote,
  CheckCircle2,
  X,
} from "lucide-react";

const ProfilePage: React.FC = () => {
  const {
    user,
    loading,
    updateUserProfile,
  } = useAuth();

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  // MAIN STATES
  const [name, setName] =
    useState("");

  const [bio, setBio] = useState(
    "Building AI battle systems & futuristic web experiences."
  );

  // TEMP STATES
  const [tempName, setTempName] =
    useState("");

  const [tempBio, setTempBio] =
    useState(bio);

  // SYNC USER DATA AFTER RELOAD
  useEffect(() => {
    if (user) {
      setName(user.name);

      setTempName(user.name);
    }
  }, [user]);

  // OPEN MODAL
  const openModal = () => {
    setTempName(name);

    setTempBio(bio);

    setIsModalOpen(true);
  };

  // SAVE PROFILE
  const handleSave = async () => {
    try {
      setIsSaving(true);

      const res =
        await updateUserProfile(
          tempName
        );

      if (res.success) {
        setName(res.user.name);

        setBio(tempBio);

        setIsModalOpen(false);
      }
    } catch (error) {
      console.log(
        "UPDATE PROFILE ERROR:",
        error
      );
    } finally {
      setIsSaving(false);
    }
  };

  // GET USER INITIAL
  const getInitial = () => {
    return (
      name
        ?.charAt(0)
        .toUpperCase() ||
      user?.email
        ?.charAt(0)
        .toUpperCase() ||
      "U"
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20">
      {/* BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
      </div>

      {/* NAVBAR */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() =>
              window.history.back()
            }
            className="group flex items-center gap-2 text-white/40 hover:text-white transition-all"
          >
            <ChevronLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />

            <span className="text-sm font-medium">
              Back
            </span>
          </button>

          <button className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all">
            <Settings size={20} />
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <main className="max-w-2xl mx-auto px-6 py-12 relative z-10">
        {/* HERO SECTION */}
        <section className="flex flex-col items-center mb-12">
          <div className="relative group cursor-pointer mb-6">
            <div className="w-28 h-28 rounded-full bg-gradient-to-b from-neutral-800 to-black border border-white/10 flex items-center justify-center text-4xl font-bold shadow-2xl relative overflow-hidden">
              {getInitial()}

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent)]" />
            </div>

            {/* EDIT BUTTON */}
            <button
              onClick={openModal}
              className="absolute bottom-0 right-0 p-2.5 bg-white text-black rounded-full border-4 border-[#050505] hover:scale-110 transition-transform shadow-xl flex items-center justify-center"
            >
              <Pencil
                size={14}
                fill="black"
              />
            </button>
          </div>

          {/* NAME */}
          <h1 className="text-3xl font-semibold tracking-tight mb-1">
            {loading
              ? "Loading..."
              : name}
          </h1>

          {/* EMAIL */}
          <div className="flex items-center gap-2 text-white/40 text-sm mb-6">
            <Mail size={14} />

            {user?.email}
          </div>

          {/* EDIT PROFILE BUTTON */}
          <button
            onClick={openModal}
            className="px-5 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium"
          >
            Edit Profile
          </button>
        </section>

        {/* INFO SECTION */}
        <div className="space-y-4">
          {/* ABOUT */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-4">
              About
            </h2>

            <p className="text-white/80 leading-relaxed text-sm">
              {bio}
            </p>
          </div>

          {/* STATUS + ROLE */}
          <div className="grid grid-cols-2 gap-4">
            {/* STATUS */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h2 className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-1">
                Status
              </h2>

              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />

                Active Now
              </div>
            </div>

            {/* ROLE */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h2 className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-1">
                Role
              </h2>

              <p className="text-sm font-medium text-white/70">
                Pro Creator
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* OVERLAY */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() =>
              !isSaving &&
              setIsModalOpen(false)
            }
          />

          {/* MODAL BOX */}
          <div className="relative w-full max-w-md bg-[#0f0f0f] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* HEADER */}
            <div className="px-8 pt-8 pb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight text-white">
                Edit Profile
              </h3>

              <button
                onClick={() =>
                  setIsModalOpen(false)
                }
                className="p-2 -mr-2 text-white/30 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* BODY */}
            <div className="px-8 pb-8 space-y-6">
              {/* NAME INPUT */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">
                  <User size={12} />
                  Display Name
                </label>

                <input
                  type="text"
                  value={tempName}
                  onChange={(e) =>
                    setTempName(
                      e.target.value
                    )
                  }
                  className="w-full h-12 px-4 rounded-xl bg-white/[0.03] border border-white/10 focus:outline-none focus:border-white/40 focus:bg-white/[0.06] transition-all text-sm"
                />
              </div>

              {/* BIO INPUT */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">
                  <TextQuote size={12} />
                  Biography
                </label>

                <textarea
                  rows={4}
                  value={tempBio}
                  onChange={(e) =>
                    setTempBio(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 focus:outline-none focus:border-white/40 focus:bg-white/[0.06] transition-all text-sm resize-none"
                />
              </div>

              {/* SAVE BUTTON */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full h-12 rounded-xl bg-white text-black font-bold hover:bg-neutral-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2
                      size={18}
                    />

                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;