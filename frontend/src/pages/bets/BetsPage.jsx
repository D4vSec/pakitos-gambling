import React, { useEffect, useState } from 'react'
import BetMarketCard from '@/components/bets/BetMarketCard'
import BetsFilterBar from '@/components/bets/BetsFilterBar'
import GoBackBtn from '@/components/buttons/GoBackBtn'
import GradientBg from '@/components/layout/GradientBg'
import Title from '@/components/layout/fonts/Title'
import CoinsSVG from '@/components/svg/pictures/CoinsSVG'
import useBets from '@/hooks/useBets'
import { useLocale } from '@/providers/LocaleProvider'
import Loading from '@/components/Loading'

const BetsPage = () => {
	const { t } = useLocale()
	const { getBets } = useBets()
	const [bets, setBets] = useState([])
	const [loading, setLoading] = useState(true)
	const [filters, setFilters] = useState({
		name: '',
		status: 'all',
	})
	const [appliedFilters, setAppliedFilters] = useState({
		name: '',
		status: 'all',
	})

	useEffect(() => {
		const loadBets = async () => {
			setLoading(true)
			const nextBets = await getBets(appliedFilters)
			setBets(nextBets)
			setLoading(false)
		}

		loadBets()
	}, [appliedFilters, getBets])

	if (loading) {
		return <Loading />
	}

	return (
		<GradientBg>
			<div className='flex w-full max-w-7xl flex-col gap-6'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<GoBackBtn link='/home' />

					<div className='badge badge-secondary badge-lg px-4 py-4 font-semibold'>{t('pages.bets.list.marketCount', { count: bets.length })}</div>
				</div>

				<section className='overflow-hidden rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-2xl shadow-primary/5 md:p-8'>
					<div className='mb-6 flex items-start gap-4'>
						<div className='rounded-2xl bg-primary p-3 text-primary-content'>
							<CoinsSVG />
						</div>

						<div className='flex-1'>
							<Title className='m-0 text-left text-4xl md:text-5xl'>{t('pages.bets.list.title')}</Title>
							<p className='mt-3 max-w-3xl text-sm text-base-content/70 md:text-base'>{t('pages.bets.list.description')}</p>
						</div>
					</div>

					<BetsFilterBar
						filters={filters}
						onChange={(nextFilters) =>
							setFilters((previousFilters) => ({
								...previousFilters,
								...nextFilters,
							}))
						}
						onApply={() => setAppliedFilters(filters)}
						onReset={() => {
							const nextFilters = {
								name: '',
								status: 'all',
							}

							setFilters(nextFilters)
							setAppliedFilters(nextFilters)
						}}
					/>
				</section>

				{bets.length > 0 ? (
					<section className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
						{bets.map((bet) => (
							<BetMarketCard key={bet.id} bet={bet} />
						))}
					</section>
				) : (
					<section className='rounded-[2rem] border border-dashed border-base-300 bg-base-100 p-8 text-center shadow-xl'>
						<h2 className='text-2xl font-bold'>{t('pages.bets.list.emptyTitle')}</h2>
						<p className='mt-3 text-base-content/70'>{t('pages.bets.list.emptyDescription')}</p>
					</section>
				)}
			</div>
		</GradientBg>
	)
}

export default BetsPage
