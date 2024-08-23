import logo from '../assets/logo.svg'
import { Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const HomeScreen = () => {
    return (
        <section className="flex">
            <div className="bg-[url('images/van-tay-media-chyT9XPAdcg-unsplash.jpg')] bg-cover bg-center lg:bg-[linear-gradient(180deg,_rgb(20,_114,_230)_0%,_#4f96ec_100%)] lg:min-w-[40rem] h-screen flex flex-col justify-center lg:rounded-tr-[3rem] lg:rounded-br-[3rem] z-10 w-full relative">
                <div className="max-h-screen lg:max-h-[25rem] h-full flex flex-col justify-evenly lg:justify-between items-center lg:bg-transparent">
                    <div className="flex max-h-[4.5rem] justify-start w-full lg:w-auto lg:justify-center gap-2 absolute lg:relative top-0 px-[1rem] py-[0.5rem] lg:p-0 bg-[#1472e6] lg:bg-transparent">
                        <img src={logo} alt="" className="w-[2rem] md:w-[3rem] lg:w-auto h-full" />
                        <span className="m-0 text-[1.5rem] md:text-[2rem] lg:text-[3rem] text-white font-bold">
                            KeyPass
                        </span>
                    </div>
                    <p className="text-[rgb(232,_241,_254)] max-w-[30rem] text-xs text-center px-[1rem] lg:px-0 lg:mt-8  lg:mb-auto font-normal leading-4">
                        Lorem ipsum dolor sit amet. Qui dolor accusantium 33 harum voluptatem ut quia architecto est quae
                        maiores et laborum necessitatibus et eligendi unde et beatae omnis. Eum cupiditate quisquam ab
                        dolorem exercitationem id deleniti maxime aut molestiae tempore?Id porro galisum non omnis totam eum
                        unde iusto sed reprehenderit repellendus et omnis laudantium sed magnam quibusdam. Est quaerat
                        voluptatem id pariatur pariatur et sunt quisquam id vero corrupti! </p>

                    <LinkContainer to="/login">
                        <Button variant="light" className='flex justify-center items-center gap-2 text-[#4B4B4B] lg:px-[8.75rem] md:px-[4.375rem] text-[1rem] font-semibold '>
                            <i className="fa-solid fa-arrow-right-to-bracket"></i>
                            Login
                        </Button>
                    </LinkContainer>
                </div>
            </div>

            <img className="hidden lg:block h-auto overflow-hidden object-cover -ml-12" src="images/van-tay-media-chyT9XPAdcg-unsplash.jpg" alt="" />
        </section>
    )
}

export default HomeScreen