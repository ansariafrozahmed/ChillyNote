import IconUser from '@/components/icon/icon-user';
import Link from 'next/link';

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex h-screen w-full flex-col items-center justify-center">
                <div className="h-16">
                    <Link href={'/'}>
                        <img className="h-full w-full object-contain" src="sagartech-logo.webp" alt="Sagar Tech Logo" />
                    </Link>
                </div>
                <div className="flex flex-col gap-4 py-10 md:flex-row">
                    <Link
                        className="flex items-center gap-2 rounded border border-[#2b2a2a] bg-[#2b2a2a] px-8 py-3 text-center text-white transition-all duration-300 ease-in-out hover:bg-transparent hover:text-[#2b2a2a] focus:outline-none focus:ring active:text-violet-500"
                        href={'/admin-login'}
                    >
                        <IconUser />
                        Admin Panel
                    </Link>

                    <Link
                        className="flex items-center gap-2 rounded border border-[#2b2a2a] bg-[#2b2a2a] px-8 py-3 text-center text-white transition-all duration-300 ease-in-out hover:bg-transparent hover:text-[#2b2a2a] focus:outline-none focus:ring active:text-violet-500"
                        href={'/employee-login'}
                    >
                        <IconUser />
                        Employee Panel
                    </Link>
                </div>
            </div>
        </>
    );
}
