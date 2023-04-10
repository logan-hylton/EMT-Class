import{f as p,o as i,c as n,a as t,g as l,w as a,F as d,r as h,i as r,t as o,_ as m,e as v}from"./index-538ec71d.js";const b={class:"row me-5"},g=t("div",{class:"col text-start"},[t("h3",null,"Activities Admin ")],-1),A={class:"col text-end"},f={class:"row me-5 mt-2"},w={class:"col-12"},y={class:"table table-striped border rounded rounded-3",style:{width:"100%"}},x=t("thead",null,[t("tr",null,[t("th",{scope:"col"},"Name "),t("th",{scope:"col"},"Type "),t("th",{scope:"col"},"Description"),t("th",{scope:"col"},"Instructions"),t("th",{scope:"col"},"Options")])],-1),k={class:"btn-group",role:"group"},N=["onClick"];function C(e,I,B,L,u,_){const c=p("RouterLink");return i(),n(d,null,[t("div",b,[g,t("div",A,[l(c,{class:"btn btn-primary me-1",to:"manage-activity/-1"},{default:a(()=>[r("Create New Activity")]),_:1})])]),t("div",f,[t("div",w,[t("table",y,[x,t("tbody",null,[(i(!0),n(d,null,h(u.activities,s=>(i(),n("tr",null,[t("td",null,o(s.Name),1),t("td",null,o(s.Type),1),t("td",null,o(s.Description),1),t("td",null,o(s.Instructions),1),t("td",null,[t("div",k,[l(c,{class:"btn btn-warning",to:"manage-activity/"+s.ActivityId},{default:a(()=>[r("Edit")]),_:2},1032,["to"]),t("button",{class:"btn btn-danger",onClick:T=>_.deleteActivity(s.ActivityId)},"Delete",8,N)])])]))),256))])])])])],64)}const D={data(){return{activities:[]}},methods:{loadActivities(){v.post(window.location.origin+"/api/activities").then(e=>this.activities=e.data).catch(e=>console.log(e))},deleteActivity(e){console.log("Delete pressed for activityId "+e)}},created(){this.loadActivities()}},$=m(D,[["render",C]]);export{$ as default};