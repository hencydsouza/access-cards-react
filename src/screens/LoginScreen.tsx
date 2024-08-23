import vectorArt from '../assets/vectorArt.svg'
import logo from '../assets/logo.svg'
import { Button, Form } from 'react-bootstrap'
import { useState } from 'react'

const LoginScreen = () => {
    const [input, setInput] = useState({
        email: '',
        password: '',
        resource: ''
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmitEvent = (e: any) => {
        e.preventDefault();
        if (input.email.length > 0 && input.password.length > 0 && input.resource.length > 0) {
            console.log(input)
        }
        // alert('Please fill all the fields')
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleInput = (e: any) => {
        const { name, value } = e.target
        setInput((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <section className="flex">
            <div className="bg-[linear-gradient(180deg,_rgb(20,_114,_230)_0%,_#4f96ec_100%)] lg:min-w-[40rem] h-screen flex-col justify-between rounded-tl-[0] rounded-br-[3rem] rounded-tr-[3rem] rounded-bl-[0] sm:flex hidden">
                <div className="flex-grow flex flex-col justify-center items-center">
                    <div className="flex justify-center gap-2 [filter:drop-shadow(-2px_3px_3px_rgba(0,_0,_0,_0.2))] max-h-[4.5rem] -rotate-90 md:rotate-0">
                        <img className='w-[2rem] md:w-[3rem] lg:w-auto h-full' src={logo} alt="" />
                        <p className='m-0 text-[1.6rem] lg:text-[3rem] text-[#FFFFFF] font-bold'>KeyPass</p>
                    </div>
                    <p className="text-[rgb(232,_241,_253)] text-[0.75rem] text-center mt-8 font-normal px-[2rem] lg:px-0 hidden md:block">Lorem ipsum dolor sit amet. Qui dolor accusantium 33 harum voluptatem
                        ut.</p>
                </div>

                <img className="max-w-full px-8 py-[0] hidden md:block" src={vectorArt} alt="" />
            </div>

            <div className="w-full h-screen flex flex-col items-center justify-between relative overflow-hidden">
                <div className="self-start px-[2rem] py-[1rem] flex justify-between w-full bg-[#1472e6] sm:bg-transparent rounded-bl-[2rem] rounded-br-[2rem]">
                    <button className="btn w-max flex gap-[8px] items-center sm:text-[#6E6E6E] text-[#fff] font-semibold left-[0] order-2">
                        <i className="fa-solid fa-arrow-left"></i>
                        Back
                    </button>
                    <div className="sm:hidden justify-center items-center gap-2 [filter:drop-shadow(-2px_3px_3px_rgba(0,_0,_0,_0.2))] flex order-1">
                        <img className='w-[2rem] md:w-[3rem] lg:w-auto h-full' src={logo} alt="" />
                        <p className='m-0 text-[1.6rem] lg:text-[3rem] text-[#FFFFFF] font-bold'>KeyPass</p>
                    </div>
                </div>
                <div className="flex-grow flex flex-col justify-center w-100">
                    <div className='px-4 w-100 md:px-0 md:max-w-[28rem] m-auto'>
                        <h2 className="text-[1.5rem] font-semibold mb-8">Account Login</h2>
                        <Form onSubmit={handleSubmitEvent}>
                            <Form.Group className="mb-8">
                                <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Login As</Form.Label>
                                <Form.Select name="resource" onChange={handleInput} aria-label="Default select example">
                                    <option>Select a login type</option>
                                    <option value="product">Product Admin</option>
                                    <option value="building">Building Admin</option>
                                    <option value="company">Company Admin</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-8" controlId="formBasicEmail">
                                <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Email address</Form.Label>
                                <Form.Control type="email" onChange={handleInput} name="email" placeholder="Enter email" className="" />
                            </Form.Group>

                            <Form.Group className="mb-8" controlId="formBasicPassword">
                                <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Password</Form.Label>
                                <Form.Control type="password" onChange={handleInput} name="password" placeholder="Password" className="" />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="flex  items-center justify-center gap-2 w-100">
                                <i className="fa-solid fa-arrow-right-to-bracket"></i>
                                Login
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LoginScreen