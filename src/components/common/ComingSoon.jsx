import { Construction, Bell } from 'lucide-react';

export function ComingSoon({ title, description, icon: Icon = Construction }) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-bg-layer-1 border border-dashed border-border-light rounded-3xl min-h-[300px]">
            <div className="w-20 h-20 bg-bg-layer-2 rounded-full flex items-center justify-center mb-6 border border-border-light">
                <Icon size={48} className="text-neon-cyan opacity-80" />
            </div>
            <h2 className="m-0 mb-3 text-3xl font-semibold text-text-primary">{title}</h2>
            <p className="m-0 mb-8 text-text-secondary max-w-[400px] leading-relaxed">{description}</p>
            <button className="flex items-center gap-2 bg-text-primary text-bg-deep border-none py-3 px-6 rounded-full font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(255,255,255,0.2)]">
                <Bell size={16} />
                Notify Me
            </button>
        </div>
    );
}
