import HTMLFlipBook from "react-pageflip";
import React from "react"
import JSONdata from "../fourthpig.json"
import {useRef} from "react"
import style from '../styles/Book.module.css'
import { useEffect,useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db} from "../firebase.js";
import { query, collection, getDocs, where } from "firebase/firestore";
/* eslint-disable */

const PageCover = React.forwardRef((props, ref) => {
    return (
      <div style={{backgroundColor:"red",zIndex:"2"}} className="page page-cover" ref={ref} data-density="hard">
        <div style={{backgroundColor:"#35C6E9",zIndex:"2",minHeight:500}} className="page-content">
          <h2 style={{color:"white",marginLeft:50,fontWeight:"bold"}} >{props.children}</h2>
        </div>
      </div>
    );
  });
  
  const Page = React.forwardRef((props, ref) => {
    return (
      <div className="page" ref={ref}>
        <div className="page-content">
          <h2 className="page-header">Page header - {props.number}</h2>
          <div className="page-image"></div>
          <div className="page-text">{props.children}</div>
          <div className="page-footer">{props.number + 1}</div>
        </div>
      </div>
    );
  });

  

export default function MyBook(props) {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const book = useRef();
  const [name, setName] = useState("");
  const[option1,setOption1] = React.useState(null);
  const[option2,setOption2] = React.useState(null);
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      //alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    fetchUserName();
  }, [user, loading]);
  return (
    <div className={style.background}>
      <HTMLFlipBook drawShadow={true} width={300} height={500} showCover={true} className={style.book} ref={book} onFlip={() => {
      setOption2(document.getElementById("button2-"+book.current.pageFlip().getCurrentPageIndex())?
      document.getElementById("button2-"+book.current.pageFlip().getCurrentPageIndex()).value:
      document.getElementById("button2-"+(book.current.pageFlip().getCurrentPageIndex()-1))?
      document.getElementById("button2-"+(book.current.pageFlip().getCurrentPageIndex()-1)).value
      :null);
      setOption1(document.getElementById("button1-"+book.current.pageFlip().getCurrentPageIndex())?
      document.getElementById("button1-"+book.current.pageFlip().getCurrentPageIndex()).value:
      document.getElementById("button1-"+(book.current.pageFlip().getCurrentPageIndex()-1))?
      document.getElementById("button1-"+(book.current.pageFlip().getCurrentPageIndex()-1)).value
      :null);
      }}>
        <PageCover>
          <h2 style={{paddingTop:40,marginLeft:-25,textAlign:"center"}}>The Fourth Little Pig</h2>
        <img style={{ minWidth:250,marginLeft:-25,marginTop:100,justifyContent:"center",display:"center" }} src={"/static/images/fourpigs/12.png"} />

        </PageCover>
        {JSONdata.story.pages.map((data) => (
          data.text.map((lines, i) => (
            <div className={style.page}>
              {i === 0 && data.first_page!=0?
                <p className={style.thenText}>Then,</p>
                : null}
                <div className={style.textBlock}>
              <p className={style.text}>{lines}</p>
              </div>
              <img style={{ minWidth:250,margin:"auto" }} src={"/static/images/fourpigs/"+ (data.first_page + i+1)+".png"} />
              {i === data.text.length-1?
              <><p className={style.text}>What should I do?</p><div className={style.ifDiv}>
                <p className={style.ifText}>If </p>
              <p className={style.text}> I...</p>
              </div></>
                :null}
                <><option id={"button1-" + data.last_page} value={data.option1} className={style.text}></option><option id={"button2-" + data.last_page} value={data.option2} className={style.text}></option></>
            </div>
          )))

        )}
      </HTMLFlipBook>
      <div className={style.buttonDiv}>
      {option1!=null?
      <div class="has-text-centered is-transparent"><button class="button" onClick={() => book.current.pageFlip().turnToPage(parseInt(option1.split(",")[1]))}>{option1.split(",")[0]}</button><button class="button" onClick={() => book.current.pageFlip().turnToPage(parseInt(option2.split(",")[1]))}>{option2.split(",")[0]}</button></div>:
      null}
      </div>
      </div>
  );
}
