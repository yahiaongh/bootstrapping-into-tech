/* Responsive navigation and optional Umami analytics */
(() => {
  "use strict";
  const body=document.body;
  const lessonId=body?.dataset.lessonId||null;
  const track=(name,properties={})=>{try{if(window.umami&&typeof window.umami.track==="function")window.umami.track(name,properties)}catch(_){}};

  const menuButton=document.querySelector(".menu-toggle");
  const nav=document.querySelector(".primary-nav");
  if(menuButton&&nav){
    menuButton.addEventListener("click",()=>{
      const open=menuButton.getAttribute("aria-expanded")!=="true";
      menuButton.setAttribute("aria-expanded",String(open));
      menuButton.setAttribute("aria-label",open?"Close navigation":"Open navigation");
      nav.classList.toggle("is-open",open);
    });
    nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
      menuButton.setAttribute("aria-expanded","false");
      menuButton.setAttribute("aria-label","Open navigation");
      nav.classList.remove("is-open");
    }));
    window.addEventListener("resize",()=>{
      if(window.innerWidth>680){nav.classList.remove("is-open");menuButton.setAttribute("aria-expanded","false");menuButton.setAttribute("aria-label","Open navigation")}
    });
  }

  document.addEventListener("click",event=>{
    const target=event.target instanceof Element?event.target:null;
    if(!target)return;
    const pdf=target.closest("a[data-pdf-download]");
    if(pdf){track("pdf_download",{lesson_id:lessonId||"unknown",file_name:pdf.dataset.fileName||pdf.getAttribute("href")?.split("/").pop()||"unknown"});return}
    const toc=target.closest(".toc a[href^='#']");
    if(toc){track("lesson_toc_click",{lesson_id:lessonId||"unknown",section_id:(toc.getAttribute("href")||"").slice(1)});return}
    const next=target.closest("a[data-next-lesson]");
    if(next){track("next_lesson_click",{from_lesson:next.dataset.fromLesson||lessonId||"unknown",to_lesson:next.dataset.toLesson||"unknown"});return}
    const topic=target.closest("button[data-topic-id]");
    if(topic){track("topic_interest_click",{lesson_id:lessonId||"unknown",topic_id:topic.dataset.topicId||"unknown"})}
  });

  document.querySelectorAll(".exercise[data-exercise-id]").forEach(exercise=>{
    let started=false;
    const start=()=>{if(started)return;started=true;track("practice_started",{lesson_id:lessonId||"unknown",exercise_id:exercise.dataset.exerciseId||"unknown"})};
    exercise.addEventListener("click",start,{once:true});
    exercise.addEventListener("focusin",start,{once:true});
  });

  document.querySelectorAll("[data-answer-reveal]").forEach(button=>{
    button.addEventListener("click",()=>{
      const id=button.dataset.exerciseId||"unknown";
      const answer=document.getElementById(`answer-${id}`);
      const willReveal=answer?answer.hidden:button.getAttribute("aria-expanded")!=="true";
      if(willReveal)track("answer_revealed",{lesson_id:lessonId||"unknown",exercise_id:id});
      if(answer){answer.hidden=!answer.hidden;button.setAttribute("aria-expanded",String(!answer.hidden));button.textContent=answer.hidden?"Reveal answer":"Hide answer"}
    });
  });

  document.querySelectorAll("[data-quiz]").forEach(quiz=>{
    const form=quiz.querySelector("form"),feedback=quiz.querySelector(".quiz-feedback");
    if(!form)return;
    form.addEventListener("submit",event=>{
      event.preventDefault();
      const selected=form.querySelector('input[type="radio"]:checked');
      if(!selected){if(feedback)feedback.textContent="Choose an answer first.";return}
      const correct=selected.value===quiz.dataset.correct;
      if(feedback)feedback.textContent=correct?"Correct — well done.":"Not quite. Review the lesson and try again.";
      if(!quiz.dataset.completed){quiz.dataset.completed="true";track("quiz_completed",{lesson_id:lessonId||"unknown",score_band:correct?"correct":"incorrect"})}
    });
  });

  document.querySelectorAll("[data-topic-id]").forEach(button=>button.addEventListener("click",()=>{
    document.querySelectorAll("[data-topic-id]").forEach(other=>other.setAttribute("aria-pressed",String(other===button)));
    const feedback=document.querySelector(".topic-feedback");
    if(feedback)feedback.textContent=`Thanks — “${button.textContent.trim()}” has been noted for this page view.`;
  }));

  if(lessonId){
    const milestones=[25,50,75,90],sent=new Set();let scheduled=false;
    const check=()=>{scheduled=false;const doc=document.documentElement,max=Math.max(1,doc.scrollHeight-window.innerHeight),depth=Math.min(100,Math.round(window.scrollY/max*100));milestones.forEach(m=>{if(depth>=m&&!sent.has(m)){sent.add(m);track("lesson_scroll_depth",{lesson_id:lessonId,depth_percent:m})}})};
    window.addEventListener("scroll",()=>{if(!scheduled){scheduled=true;window.requestAnimationFrame(check)}},{passive:true});
    window.addEventListener("resize",check,{passive:true});check();

    const threshold=30000;let visibleSince=document.visibilityState==="visible"?Date.now():null,accumulated=0,fired=false,timer=null;
    const clear=()=>{if(timer){clearTimeout(timer);timer=null}};
    const elapsed=()=>accumulated+(visibleSince===null?0:Date.now()-visibleSince);
    const schedule=()=>{clear();if(fired||document.visibilityState!=="visible"||visibleSince===null)return;timer=setTimeout(()=>{if(document.visibilityState==="visible"&&elapsed()>=threshold&&!fired){fired=true;accumulated=threshold;visibleSince=null;track("engaged_reading_30s",{lesson_id:lessonId})}else schedule()},Math.max(0,threshold-elapsed()))};
    document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"){if(visibleSince!==null)accumulated+=Date.now()-visibleSince;visibleSince=null;clear()}else if(!fired){visibleSince=Date.now();schedule()}});
    if(visibleSince!==null)schedule();
  }
})();