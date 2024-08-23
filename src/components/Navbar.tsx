const Navbar = () => {
    return (
            <nav id="navbar" className="w-full flex justify-between h-max px-[1.5rem] py-[0.6rem] sm:px-[2.5rem] sm:py-[1rem] items-center bg-[#FFFFFF] relative [filter:drop-shadow(0px_4px_4px_rgba(0,_0,_0,_0.01))] before:absolute before:content-[''] before:bg-[#FFFFFF] before:w-[50px] before:h-[50px] before:-left-[50px] before:top-[0] shadow-sm">
                <div className="font-medium text-[#4B4B4B] hidden sm:block">
                    Date: <span className="text-[#000] font-normal">{(new Date).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-3 ml-auto sm:m-0">
                    <div className="w-[2rem] h-[2rem] sm:w-[2.5rem] sm:h-[2.5rem] lg:w-[3.125rem] lg:h-[3.125rem] bg-[#CACACA] rounded-[50%] m-auto">
                        <svg className="h-full flex m-auto scale-[0.8] sm:scale-100" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                                stroke="#101828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>

                    <div className="m-0">
                        <p className="m-0 text-[0.8rem] sm:text-[1rem] font-semibold">John Smith</p>
                        <p className="m-0 text-[0.675rem] sm:text-[0.875rem] text-[#B3B3B3] font-light">Johnsmith@gmail.com</p>
                    </div>
                </div>
            </nav>
    )
}

export default Navbar