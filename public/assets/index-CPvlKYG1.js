import{a as d,s as o,M as r,H as l}from"./index-BT0gdKpN.js";class p{constructor(e,t){this.parent=e,this.id=t!=null?Number(t):null,this.isNew=this.id===null}get pageRoot(){return document.getElementById("edit-page")}getHTML(){return'<div class="container-fluid page-wrapper"><div id="edit-page"></div></div>'}getFormHTML(e={}){const t=e.mission_name||"",s=e.description||"",i=e.image||"";return`
        <div class="edit-form-wrapper">
            <div class="row g-4">
                <!-- Превью изображения -->
                <div class="col-12 col-md-5">
                    <div class="edit-img-preview-wrap">
                        <img
                            id="edit-img-preview"
                            src="${i||"https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=800&q=85"}"
                            alt="Mission preview"
                            class="edit-img-preview"
                            onerror="this.src='https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=800&q=85'"
                        />
                    </div>
                </div>

                <!-- Поля формы -->
                <div class="col-12 col-md-7">
                    <div class="d-flex flex-column gap-3">

                        <div>
                            <label for="edit-name" class="edit-label">Mission Name</label>
                            <input
                                type="text"
                                id="edit-name"
                                class="form-control edit-input"
                                value="${t}"
                                placeholder="e.g. Starlink Group 6-14"
                            />
                        </div>

                        <div>
                            <label for="edit-image" class="edit-label">Image URL</label>
                            <input
                                type="url"
                                id="edit-image"
                                class="form-control edit-input"
                                value="${i}"
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label for="edit-description" class="edit-label">Description</label>
                            <textarea
                                id="edit-description"
                                class="form-control edit-input"
                                rows="5"
                                placeholder="Mission description..."
                            >${s}</textarea>
                        </div>

                        <!-- Кнопка сохранения появляется в ЛР6 -->
                        <div class="d-flex gap-2 mt-2">
                            <button id="btn-save" class="btn btn-light flex-grow-1">
                                ${this.isNew?"+ Create Mission":"✓ Save Changes"}
                            </button>
                            <button id="btn-cancel" class="btn btn-outline-secondary">
                                Cancel
                            </button>
                        </div>

                        <!-- Статусное сообщение -->
                        <div id="save-status" class="edit-status" style="display:none;"></div>

                    </div>
                </div>
            </div>
        </div>`}async getData(){const{data:e,status:t}=await d.get(o.getMissionById(this.id));t===200&&e?this.renderForm(e):this.pageRoot.innerHTML=`
                <div class="text-center py-5">
                    <p class="fs-5 fw-semibold text-white mb-2">Mission not found</p>
                    <p class="text-secondary">Could not load mission data.</p>
                </div>`}async onSave(){const e=document.getElementById("edit-name").value.trim(),t=document.getElementById("edit-image").value.trim(),s=document.getElementById("edit-description").value.trim();if(!e||!s){this.showStatus("error","Mission Name and Description are required.");return}const i={mission_name:e,image:t,description:s},n=document.getElementById("btn-save");n.disabled=!0,n.textContent="Saving...";let a;this.isNew?a=await d.post(o.createMission(),i):a=await d.patch(o.updateMissionById(this.id),i),a.status===200||a.status===201?(this.showStatus("success",this.isNew?"Mission created!":"Changes saved!"),setTimeout(()=>new r(this.parent).render(),1e3)):(n.disabled=!1,n.textContent=this.isNew?"+ Create Mission":"✓ Save Changes",this.showStatus("error",`Error ${a.status}. Please try again.`))}showStatus(e,t){const s=document.getElementById("save-status");s&&(s.style.display="block",s.className=`edit-status edit-status--${e}`,s.textContent=t)}renderForm(e={}){this.pageRoot.innerHTML="",this.pageRoot.insertAdjacentHTML("beforeend",`
            <div class="mb-4">
                <p class="page-subtitle">${this.isNew?"New Mission":"Edit Mission"}</p>
                <h1 class="page-title">${this.isNew?"Add Mission":e.mission_name||"Edit Mission"}</h1>
            </div>
        `),this.pageRoot.insertAdjacentHTML("beforeend",this.getFormHTML(e)),document.getElementById("edit-image").addEventListener("input",t=>{const s=document.getElementById("edit-img-preview");s&&t.target.value&&(s.src=t.target.value)}),document.getElementById("btn-save").addEventListener("click",()=>this.onSave()),document.getElementById("btn-cancel").addEventListener("click",()=>{new r(this.parent).render()})}onHomeClick(){new r(this.parent).render()}render(){this.parent.innerHTML="",new l(this.parent).render(this.onHomeClick.bind(this)),this.parent.insertAdjacentHTML("beforeend",this.getHTML()),this.isNew?this.renderForm({}):(this.pageRoot.innerHTML=`
                <div class="text-center py-5">
                    <div class="spinner-border text-light" role="status"></div>
                    <p class="text-secondary mt-3">Loading mission data...</p>
                </div>`,this.getData())}}export{p as EditPage};
