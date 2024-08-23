import { Button } from "react-bootstrap"
import Breadcrumb from "../../components/Breadcrumb"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import BuildingCard from "../../components/BuildingCard"

const BuildingsScreen = () => {
    return (
        <div>
            <div className="buildings-content">
                <div className="flex items-start gap-3 md:items-center justify-between flex-col md:flex-row">
                    <div>
                        <BreadcrumbContainer>
                            <Breadcrumb text="Dashboard" />
                            <Breadcrumb active text="Buildings" />
                        </BreadcrumbContainer>
                        <p className="text-[0.7rem] md:text-[1rem] font-medium text-[#B3B3B3] m-0">View all buildings</p>
                    </div>

                    <Button variant="primary" type="submit" className="flex  items-center justify-center gap-2">
                        <i className="fa-solid fa-plus"></i>
                        Add
                    </Button>
                </div>

                <div className="buildings-content-center">
                    {/* <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Building Name</th>
                                            <th>Owner Company</th>
                                            <th>Location</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="icon-container">
                                                    <img src="svg/building.svg" alt="">
                                                </div>
                                            </td>
                                            <td>
                                                Ajantha Towers
                                            </td>
                                            <td>PaceWisdom Solutions</td>
                                            <td>Bejai, Mangalore</td>
                                            <td>
                                                <div>
                                                    <button type="button" className="btn edit-btn">
                                                        <img src="svg/edit.svg" alt="">
                                                            Edit
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>  */}
                    <div className="gap-3 mt-8 grid lg:grid-cols-2 xl:grid-cols-3">
                        <BuildingCard buildingName="Ajantha Towers" buildingOwner="PaceWisdom Solutions" buildingLocation="Bejai, Mangalore" />
                        <BuildingCard buildingName="Brooklyn Simmons" buildingOwner="PaceWisdom Solutions" buildingLocation="Kadri, Mangalore" />
                        <BuildingCard buildingName="Leslie Alexander" buildingOwner="EG" buildingLocation="Kapikad, Mangalore" />

                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuildingsScreen