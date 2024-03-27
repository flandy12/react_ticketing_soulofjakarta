const LoadingAnimation = (props) =>{
    return (   
    <div className={`h-screen w-screen ${props.click === true ? 'flex' : 'hidden'} items-center justify-center fixed  z-50 bg-loading`} id="loading-animation">
        <div className="bg-white w-[250px] p-5 rounded-xl">
            <div className="">
                <img src="/images/icon/tess.gif" alt="loading.." width="250" />
            </div>
        </div>
    </div>
    )
}
export default LoadingAnimation;