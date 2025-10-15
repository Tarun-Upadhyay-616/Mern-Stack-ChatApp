import Lottie from 'react-lottie';
import { animationoptions } from '../utils/utils.js';

const EmptyChatContainer = () => {
  return (
    <div className='flex-1 bg-white dark:bg-[#1c1d25] flex-col justify-center items-center hidden md:flex'>
      <Lottie
        isClickToPauseDisabled={true}
        height={400}
        width={400}
        options={animationoptions}
      />
      <p className="text-lg lg:text-2xl font-semibold text-gray-700 mt-4 justify-center">
        Select a chat to start messaging
      </p>
      <p className="text-gray-500 dark:text-gray-400">
        Your messages will appear here.
      </p>
    </div>
  );
};

export default EmptyChatContainer;