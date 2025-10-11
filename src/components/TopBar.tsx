import { useLaserEyes } from '@omnisat/lasereyes'
import { AccountButton } from './AccountButton'
import ConnectButton from './ConnectButton'

export function Topbar() {
	const { address } = useLaserEyes()

	return (
		<div className='mb-2 mt-2 px-2 flex w-full justify-between'>
			<div className='flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3'>
				<p className='text-2xl sm:text-md text-blue-500 font-normal tracking-wide opacity-80 italic'>SatsMan</p>
			</div>
			<div className='mr-2'>{address ? (<AccountButton />) : (<ConnectButton />)}</div>
		</div>
	)
}
