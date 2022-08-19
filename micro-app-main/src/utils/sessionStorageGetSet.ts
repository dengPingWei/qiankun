// atacct_portal_visit: 头部导航西欧逆袭
type MenuItem = {
  key: string;
  title: string;
  icon?: string;
  path: string;
  children?: MenuItem[];
};
export function getHeaderNav(): any {
  const atacct_portal_visit = sessionStorage.atacct_portal_visit
  return eval(atacct_portal_visit) || [];
}

// 添加头部导航信息
export function setAddHeaderNav(nav: MenuItem): void {
  console.log("--setAddHeaderNav---",nav,getHeaderNav())
  let headerNav = getHeaderNav()
  let isThere = false
  for (let i = 0; i < headerNav.length; i++) {
    const menu = headerNav[i];
    const { path } = menu;
    if (path === nav.path) {
      isThere = true
      break
    }
  }
  if (!isThere) {
    nav.width = nav.title.length * 14 + 16
    headerNav.push(nav)
    console.log('__atacct_portal_visit_',headerNav)
    sessionStorage.setItem("atacct_portal_visit",JSON.stringify(headerNav))
  }

}
// 设置头部导航信息
export function setHeaderNav(navList: MenuItem[]): void {
  sessionStorage.setItem("atacct_portal_visit",JSON.stringify(navList))
}