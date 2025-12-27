'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Sparkles, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'


import { Session } from 'next-auth';

function getNavigation(session: Session | null | undefined) {
	return [
		{ name: 'Home', href: '/' },
		{ name: 'Guides', href: '/guides' },
		{ name: 'Blog', href: '/blog' },
		{ name: 'Generate Now', href: '/generate-now' },
		session && session.user
			? { name: 'Dashboard', href: '/user/dashboard' }
			: { name: 'Login', href: '/login' },
	];
}


export default function Navbar() {
	const { data: session } = useSession();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const pathname = usePathname();
	const navigation = getNavigation(session);

	// Prevent background scroll when mobile menu is open
	React.useEffect(() => {
		if (mobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [mobileMenuOpen]);

	return (
		<header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
			<div className="mx-auto flex max-w-7xl items-center py-4 pr-4 lg:pr-8 pl-0 lg:pl-0">
				<Link href="/" className="flex items-center mr-8">
					<span className="font-bold text-xl text-primary">Verbshift</span>
				</Link>
				<nav className="flex-1 flex items-center justify-end">
					<div className="hidden lg:flex lg:gap-x-12">
						{navigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className={cn(
									'px-4 text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600',
									pathname === item.href && 'text-primary-600'
								)}
							>
								{item.name}
							</Link>
						))}
					</div>
					<div className="flex lg:hidden ml-4">
						<button
							type="button"
							className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
							onClick={() => setMobileMenuOpen(true)}
						>
							<Menu className="h-6 w-6" />
						</button>
					</div>
				</nav>
			</div>

			{/* Mobile menu */}
			<div className={cn('lg:hidden', mobileMenuOpen ? 'block' : 'hidden')}>
				{/* Overlay */}
				{mobileMenuOpen && (
					<div
						className="fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity duration-300"
						aria-hidden="true"
						onClick={() => setMobileMenuOpen(false)}
					/>
				)}
				{/* Slide-in menu */}
				<div
					className={cn(
						"fixed inset-y-0 right-0 z-50 w-full sm:max-w-sm overflow-y-auto bg-white px-6 py-6 ring-1 ring-gray-900/10 transition-transform duration-300",
						mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
					)}
					role="dialog"
					aria-modal="true"
					tabIndex={-1}
				>
					<div className="flex items-center justify-between">
						<Link href="/" className="-m-1.5 p-1.5 flex items-center">
							<span className="font-bold text-xl text-primary">Verbshift</span>
						</Link>
						<button
							type="button"
							className="-m-2.5 rounded-md p-2.5 text-gray-700"
							onClick={() => setMobileMenuOpen(false)}
							aria-label="Close menu"
						>
							<X className="h-6 w-6" />
						</button>
					</div>
					<div className="mt-6 flow-root">
						<div className="-my-6 divide-y divide-gray-500/10">
							<div className="space-y-2 py-6">
								{navigation.map((item) => (
									<Link
										key={item.name}
										href={item.href}
										className={cn(
											'-mx-3 block rounded-lg px-3 py-2 text-base font-medium',
											pathname === item.href
												? 'bg-primary-50 text-primary-600'
												: 'text-gray-700 hover:bg-gray-50'
										)}
										onClick={() => setMobileMenuOpen(false)}
									>
										{item.name}
									</Link>
								))}
							</div>
							<div className="py-6 space-y-2">
								<Link
									href="/search"
									className="-mx-3 flex items-center gap-2 rounded-lg px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50"
									onClick={() => setMobileMenuOpen(false)}
								>
									<Search className="h-5 w-5" />
									Search
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
