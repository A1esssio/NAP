const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-CPvlKYG1.js","assets/index-BT0gdKpN.js","assets/index-Bg2pBFms.css"])))=>i.map(i=>d[i]);
import{a as i,s,_ as a,M as d,H as n}from"./index-BT0gdKpN.js";class l{constructor(e,t){this.parent=e,this.id=Number(t)}get pageRoot(){return document.getElementById("detail-page")}getHTML(){return'<div class="container-fluid page-wrapper"><div id="detail-page"></div></div>'}async getData(){const{data:e,status:t}=await i.get(s.getMissionById(this.id));t===200&&e?this.renderData(e):this.pageRoot.innerHTML=`
                <div class="text-center py-5">
                    <p class="fs-5 fw-semibold text-white mb-2">Mission not found</p>
                    <p class="text-secondary">This mission may have been deleted or the server is unavailable.</p>
                </div>`}renderData(e){this.pageRoot.innerHTML="",this.pageRoot.insertAdjacentHTML("beforeend",`
            <div class="mb-4">
                <p class="page-subtitle">Mission Details</p>
                <h1 class="page-title">${e.mission_name}</h1>
            </div>

            <div class="card detail-card">
                <div class="row g-0">
                    <div class="col-md-6">
                        <img
                            src="${e.image}"
                            class="detail-card__img img-fluid"
                            alt="${e.mission_name}"
                            onerror="this.src='https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=800&q=85'"
                        />
                    </div>
                    <div class="col-md-6">
                        <div class="card-body detail-card__body d-flex flex-column gap-3 h-100 p-4">
                            <div class="detail-card__meta-item">
                                <span class="detail-card__meta-label">Mission ID</span>
                                <strong class="detail-card__meta-value">#${String(e.id).padStart(3,"0")}</strong>
                            </div>
                            <hr class="border-secondary" />
                            <p class="card-text detail-card__text">${e.description}</p>
                            <div class="mt-auto">
                                <button class="btn btn-outline-warning" id="btn-edit-detail">
                                    ✎ Edit Mission
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `),document.getElementById("btn-edit-detail").addEventListener("click",()=>{a(async()=>{const{EditPage:t}=await import("./index-CPvlKYG1.js");return{EditPage:t}},__vite__mapDeps([0,1,2])).then(({EditPage:t})=>{new t(this.parent,this.id).render()})})}onHomeClick(){new d(this.parent).render()}render(){this.parent.innerHTML="",new n(this.parent).render(this.onHomeClick.bind(this)),this.parent.insertAdjacentHTML("beforeend",this.getHTML()),this.pageRoot.innerHTML=`
            <div class="text-center py-5">
                <div class="spinner-border text-light" role="status"></div>
                <p class="text-secondary mt-3">Loading mission data...</p>
            </div>`,this.getData()}}export{l as DetailPage};
