import { useState,useRef } from 'react'
import NavButton from './NavButton';
import '../../css/storyboardform.css';
import {useNavigate} from 'react-router-dom'
function StoryboardForm({name} : {name: String}){
    const durationDiv=useRef<HTMLDivElement| null>(null);
    const frameDiv=useRef<HTMLDivElement| null>(null);
    const storyboardform = useRef<HTMLDivElement | null>(null);
    const [count,setCount] = useState(0)
    const navigate = useNavigate(); // Hook is called at the top level
    const goTo = (url:string) => {
        navigate(url); 
    };
    const displayStoryboardForm = ()=>{
        if (!storyboardform.current)return;
        if(storyboardform.current.classList.contains("on")){
            storyboardform.current.classList.remove('on');
            storyboardform.current.classList.add('off');
        }
        else if(storyboardform.current.classList.contains("off")){
            storyboardform.current.classList.remove('off');
            storyboardform.current.classList.add('on');
        }
    }
    function determineStoryboardFrames(e: React.SubmitEvent<HTMLFormElement>){
        if(!durationDiv.current || !frameDiv.current) return;
        const formData=new FormData(e.target as HTMLFormElement)
        var duration: number | null;
        var frames: number | null;
        if(durationDiv.current.classList.contains("on")){
        duration=formData.get("storyboard_duration") as number | null;
        if(duration==null){
            duration=5;
        }
        frames=Math.trunc(duration/5);        
        }
        else{
            frames=formData.get("storyboardnum") as number | null;
            if (frames==null){
                frames=1;
            }
            duration=frames*5;
        }
        return {frames: frames, duration: duration};
    }
    function changeFrameAmountDeterminer(){
        if(!durationDiv.current || !frameDiv.current) return;
        if(durationDiv.current.classList.contains("on")){
            durationDiv.current.classList.remove('on');
            durationDiv.current.classList.add('off');
            frameDiv.current.classList.remove('off');
            frameDiv.current.classList.add("on");
        }
        else{
            durationDiv.current.classList.remove('off');
            durationDiv.current.classList.add('on');
            frameDiv.current.classList.remove('on');
            frameDiv.current.classList.add("off"); 
        }
    }

    return(
        <>
            <button className="profile-toolbar-button"  onClick={displayStoryboardForm}>{name}</button>
            <div className="storyboardform off" id="storyboard-form-page" ref={storyboardform} >
                <button className='storyboardform-exitbutton' onClick={displayStoryboardForm}>X</button>
                <div className="storyboardform-form">
                    <h2>Storyboard Generator</h2> 
                    <button onClick={()=>{changeFrameAmountDeterminer()}} className="form-button">Change What Determines the Frame Quantity</button>
                    <form id="storyboard_generate" onSubmit={(e)=>{
                            e.preventDefault();
                            const obj = determineStoryboardFrames(e);
                            localStorage.setItem("createFromStoryboard", JSON.stringify(obj));
                            goTo("/workshop");
                        }}>
                    <div id="duration" className="form-determiner-display on" ref={durationDiv}>
                        <label htmlFor="storyboard_duration">How long would you like your storyboard to be?</label><br></br>
                        <input type="number" id="storyboard_duration" name="storyboard_duration" className="form-input"></input><br></br>
                    </div>
                    <div id="frame" className="form-determiner-display off" ref={frameDiv}>
                        <label htmlFor="storyboardnum">How many storyboard frames do you want?</label><br></br>
                        <input type="number" id="storyboardnum" name="storyboardnum" className="form-input"></input><br></br>
                    </div>
                    <button type="submit" form="storyboard_generate" className="form-button">Create Storyboard</button>
                    </form>   
                </div>
                 
            </div>
        </>
    )
}
export default StoryboardForm;