import { Link, useActionData } from "react-router-dom"
import LayoutPageDashboard from "../layout";
import LayoutPageProfie from "./layout";

const ProfilePage = () => {
    const UserData = JSON.parse(localStorage.getItem('user_data'));
    return(
        <LayoutPageProfie>
            <div class="flex justify-between items-center border-radius-0 mb-5">
                <h2 className="text-xl font-bold">INFORMASI DASAR</h2>
                <button className="py-2 px-5 bg-amber-300 rounded font-semibold">
                <Link to={'/dashboard/profile/edit'} >Edit Profile</Link>
                </button>
            </div>
            <section>
                <div className="grid grid-cols-3">
                    <div className="space-y-5">
                        <div>
                            <label className="capitalize text-sm font-semibold text-slate-500">Nama Lengkap</label>
                            <p>{UserData.user.results.member.name}</p>
                        </div>
                        <div>
                            <label className="capitalize text-sm font-semibold text-slate-500">No. Telepon</label>
                            <p>{UserData.user.results.member.phone_number}</p>
                        </div>

                        <div>
                            <label className="capitalize text-sm font-semibold text-slate-500">Tanggal Lahir</label>
                            <p>{UserData.user.results.member.date_of_birth}</p>
                        </div>
                    </div>
                    <div className="space-y-5">
                        <div>
                            <label className="capitalize text-sm font-semibold text-slate-500">Kota</label>
                            <p>{UserData.user.results.member.city}</p>
                        </div>

                        <div>
                            <label className="capitalize text-sm font-semibold text-slate-500">Alamat</label>
                            <p>{UserData.user.results.member.address}</p>
                        </div>

                    </div>
                        <div className="space-y-5">
                            <div>
                                <label className="capitalize text-sm font-semibold text-slate-500">Alamat Email</label>
                                <p>{UserData.user.results.member.email}</p>
                            </div>

                            <div>
                                <label className="capitalize text-sm font-semibold text-slate-500">Jenis kelamin</label>
                                <p>{UserData.user.results.member.gender}</p>
                            </div>
                        </div>
                </div>
            </section>
        </LayoutPageProfie>
    );
}

export default ProfilePage;