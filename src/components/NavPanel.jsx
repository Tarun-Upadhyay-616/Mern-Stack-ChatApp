
import { useNavigate } from 'react-router-dom';
import { useAppStore } from './../Store/index';
// import { Avatar } from 'react-avatar';
import { getColor } from './../utils/utils';
const NavPanel = () => {
    const navigate = useNavigate()
    const { userInfo } = useAppStore()

    return (
        <div className="w-[20vw] bg-[#1f4352] rounded-l-4xl p-5 hidden lg:block text-white">
            <div class="flex items-center justify-center flex-col gap-5">
                Logo Here
                <div className='h-32 w-32 rounded-full overflow-hidden ' >
                    {userInfo.image ? (
                        <Avatar src={image} round={true} className='object-cover w-full h-full bg-black ' />
                    ) : (
                        <div className={`uppercase h-32 w-32 text-6xl border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)} `} >
                            {userInfo.firstname
                                ? userInfo.firstname.split("").shift()
                                : userInfo.email.split("").shift()
                            }
                        </div>
                    )}
                </div>
                <div class="d-flex text-2xl">
                    {userInfo.firstname + "  " + userInfo.lastname}
                </div>
                <button className='bg-[#2f2b30] w-full p-3 rounded-3' onClick={() => navigate("/profile")} >Edit Profile</button>
            </div>
            
        </div>
    )
}

export default NavPanel
