"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  User, Bell, Shield, Wallet, CreditCard, Camera, Check,
  Eye, EyeOff
} from "lucide-react"
import { useUser } from "@clerk/nextjs"

const TABS = [
  { key: "profile",       label: "Profile",       icon: User },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security",      label: "Security",      icon: Shield },
  { key: "wallet",        label: "Wallet",        icon: Wallet },
  { key: "billing",       label: "Billing",       icon: CreditCard },
]

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{ height: "22px" }}
      className={`relative w-10 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-[#FF7A00]" : "bg-[#EAD9CC]"}`}
    >
      <span
        className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-all ${checked ? "left-[calc(100%-20px)]" : "left-0.5"}`}
      />
    </button>
  )
}

function ProfileTab() {
  const { user } = useUser()
  const clerkName = user?.fullName ?? user?.firstName ?? ""
  const clerkEmail = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? ""

  const [name, setName] = useState(clerkName)
  const [username, setUsername] = useState(user?.username ?? "")
  const [bio, setBio] = useState("")
  const [website, setWebsite] = useState("")
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 600))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-[#FF7A00] flex items-center justify-center text-white font-black text-2xl">
            {(name?.[0] ?? clerkEmail?.[0] ?? "?").toUpperCase()}
          </div>
          <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border-2 border-[#EAD9CC] flex items-center justify-center hover:border-[#FF7A00] transition-colors">
            <Camera className="w-3 h-3 text-[#9A7560]" />
          </button>
        </div>
        <div>
          <p className="font-bold text-[#2D1C12] text-sm">{name || "Your name"}</p>
          <p className="text-xs text-[#9A7560]">{clerkEmail || "—"}</p>
          <button className="text-[11px] font-bold text-[#FF7A00] hover:underline mt-0.5">Upload photo</button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { label: "Display Name", value: name,     setter: setName,     placeholder: "Your name",    full: false },
          { label: "Username",     value: username, setter: setUsername, placeholder: "username",      full: false },
          { label: "Website",      value: website,  setter: setWebsite,  placeholder: "https://...",   full: true },
        ].map(f => (
          <div key={f.label} className={f.full ? "sm:col-span-2" : ""}>
            <label className="block text-xs font-black text-[#2D1C12] uppercase tracking-wider mb-1.5">{f.label}</label>
            <input
              value={f.value}
              onChange={e => f.setter(e.target.value)}
              placeholder={f.placeholder}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#EAD9CC] bg-white focus:outline-none focus:border-[#FF7A00] text-sm text-[#2D1C12] placeholder-[#C4A898] transition-colors"
            />
          </div>
        ))}
        <div className="sm:col-span-2">
          <label className="block text-xs font-black text-[#2D1C12] uppercase tracking-wider mb-1.5">Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={2}
            className="w-full px-4 py-3 rounded-xl border-2 border-[#EAD9CC] bg-white focus:outline-none focus:border-[#FF7A00] text-sm text-[#2D1C12] resize-none transition-colors"
          />
        </div>
      </div>
      <button
        onClick={handleSave}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
          saved ? "bg-emerald-500 text-white" : "bg-[#FF7A00] text-white hover:bg-[#e56e00]"
        }`}
      >
        {saved ? <><Check className="w-4 h-4" /> Saved!</> : "Save Changes"}
      </button>
    </div>
  )
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    generation_done: true,
    weekly_report: true,
    credits_low: true,
    new_features: false,
    marketing: false,
    token_rewards: true,
  })
  const groups = [
    { title: "Generation", items: [
      { key: "generation_done", label: "Generation complete",  desc: "Notify when AI finishes generating" },
      { key: "credits_low",     label: "Credits running low",  desc: "Alert at < 20% credits remaining" },
    ]},
    { title: "Reports", items: [
      { key: "weekly_report", label: "Weekly CTR report", desc: "Weekly summary of thumbnail performance" },
    ]},
    { title: "Token & Rewards", items: [
      { key: "token_rewards", label: "THUMB rewards", desc: "When you earn THUMB from staking or referrals" },
    ]},
    { title: "Product", items: [
      { key: "new_features", label: "New features",    desc: "Announcements about new ThumbFi features" },
      { key: "marketing",    label: "Tips & tutorials", desc: "Creator tips and product tutorials" },
    ]},
  ]
  return (
    <div className="space-y-5">
      {groups.map(g => (
        <div key={g.title}>
          <p className="text-[11px] font-black text-[#2D1C12] uppercase tracking-wider mb-2">{g.title}</p>
          <div className="space-y-1">
            {g.items.map(item => (
              <div key={item.key} className="flex items-center justify-between px-4 py-3 bg-[#FFF7EF] rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-[#2D1C12]">{item.label}</p>
                  <p className="text-[11px] text-[#9A7560]">{item.desc}</p>
                </div>
                <ToggleSwitch checked={prefs[item.key as keyof typeof prefs]} onChange={v => setPrefs(p => ({...p, [item.key]: v}))} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function SecurityTab() {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-black text-[#2D1C12] uppercase tracking-wider mb-3">Change Password</p>
        <div className="space-y-3">
          {[
            { label: "Current password", show: showCurrent, toggle: () => setShowCurrent(v => !v) },
            { label: "New password",     show: showNew,     toggle: () => setShowNew(v => !v) },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-bold text-[#6B3F2A] mb-1.5">{f.label}</label>
              <div className="relative">
                <input
                  type={f.show ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-[#EAD9CC] bg-white focus:outline-none focus:border-[#FF7A00] text-sm text-[#2D1C12] transition-colors"
                />
                <button type="button" onClick={f.toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A7560]">
                  {f.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-3 px-5 py-2.5 rounded-xl bg-[#FF7A00] text-white font-bold text-sm hover:bg-[#e56e00] transition-all">
          Update Password
        </button>
      </div>
      <div>
        <p className="text-[11px] font-black text-[#2D1C12] uppercase tracking-wider mb-3">Two-Factor Auth</p>
        <div className="flex items-center justify-between px-4 py-4 bg-[#FFF7EF] rounded-xl">
          <div>
            <p className="text-sm font-semibold text-[#2D1C12]">Enable 2FA</p>
            <p className="text-[11px] text-[#9A7560]">Add extra security with an authenticator app</p>
          </div>
          <ToggleSwitch checked={twoFactor} onChange={setTwoFactor} />
        </div>
      </div>
      <div>
        <p className="text-[11px] font-black text-[#2D1C12] uppercase tracking-wider mb-3">Active Sessions</p>
        <div className="px-4 py-4 bg-[#FFF7EF] rounded-xl">
          <p className="text-sm font-semibold text-[#2D1C12]">This device</p>
          <p className="text-[11px] text-[#9A7560]">You&apos;re signed in on this device. Session management is handled by your account provider.</p>
        </div>
      </div>
    </div>
  )
}

function WalletTab() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-black text-[#2D1C12] uppercase tracking-wider mb-3">Connected Wallet</p>
        <div className="flex items-center justify-between px-4 py-4 bg-[#FFF7EF] rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center"><Wallet className="w-4 h-4 text-[#9A7560]" /></div>
            <div>
              <p className="text-sm font-bold text-[#2D1C12]">No wallet connected</p>
              <p className="text-[11px] text-[#9A7560]">Connect a wallet to manage $THUMB and pay with tokens.</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p className="text-[11px] font-black text-[#2D1C12] uppercase tracking-wider mb-3">Add Another Wallet</p>
        <div className="grid grid-cols-2 gap-3">
          {["MetaMask", "WalletConnect", "Coinbase Wallet", "Phantom"].map(w => (
            <button key={w} className="flex items-center gap-2.5 px-4 py-3 bg-[#FFF7EF] rounded-xl border-2 border-[#EAD9CC] hover:border-[#FF7A00]/40 transition-all text-sm font-semibold text-[#6B3F2A]">
              <div className="w-5 h-5 rounded-md bg-white border border-[#EAD9CC]" />
              {w}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function BillingTab() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-black text-[#2D1C12] uppercase tracking-wider mb-3">Payment Method</p>
        <div className="flex items-center justify-between px-4 py-4 bg-[#FFF7EF] rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center"><CreditCard className="w-4 h-4 text-[#9A7560]" /></div>
            <div>
              <p className="text-sm font-bold text-[#2D1C12]">No payment method</p>
              <p className="text-[11px] text-[#9A7560]">Add a card when you upgrade to a paid plan.</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p className="text-[11px] font-black text-[#2D1C12] uppercase tracking-wider mb-3">Billing History</p>
        <div className="px-4 py-6 bg-[#FFF7EF] rounded-xl text-center">
          <p className="text-sm font-semibold text-[#2D1C12]">No invoices yet</p>
          <p className="text-[11px] text-[#9A7560] mt-1">You&apos;re on the Free plan — invoices appear here after your first payment.</p>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [tab, setTab] = useState("profile")

  const tabContent: Record<string, React.ReactNode> = {
    profile:       <ProfileTab />,
    notifications: <NotificationsTab />,
    security:      <SecurityTab />,
    wallet:        <WalletTab />,
    billing:       <BillingTab />,
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-black text-[#2D1C12]">Settings</h1>
        <p className="text-[#9A7560] text-sm mt-1">Manage your account, preferences, and integrations</p>
      </motion.div>

      <div className="grid md:grid-cols-[200px_1fr] gap-6">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.06 }}
          className="space-y-1"
        >
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t.key
                  ? "bg-[#FF7A00] text-white shadow-sm"
                  : "text-[#6B3F2A] hover:bg-[#F5EDE3] hover:text-[#2D1C12]"
              }`}
            >
              <t.icon className="w-4 h-4" strokeWidth={2} />
              {t.label}
            </button>
          ))}
        </motion.div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl border border-[#EAD9CC]/60 p-6"
        >
          <h2 className="font-black text-[#2D1C12] mb-6 text-lg">
            {TABS.find(t => t.key === tab)?.label}
          </h2>
          {tabContent[tab]}
        </motion.div>
      </div>
    </div>
  )
}
