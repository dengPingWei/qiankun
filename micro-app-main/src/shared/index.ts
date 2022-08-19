import store from "./store";
type MenuItem = {
  key: string;
  title: string;
  icon?: string;
  path: string;
  children?: MenuItem[];
};
class Shared {
  /**
   * 获取 Token
   */
  public getToken(): string {
    const state = store.getState();
    return state.token || "";
  }

  /**
   * 设置 Token
   */
  public setToken(token: string): void {
    // 将 token 的值记录在 store 中
    store.dispatch({
      type: "SET_TOKEN",
      payload: token
    });
  }
  /**
   * 设置 Global
   */
   public setGlobal(global: any): void {
    // 将 token 的值记录在 store 中
    store.dispatch({
      type: "SET_GLOBAL",
      payload: global
    });
  }
  /**
   * 设置 User
   */
   public setUser(user: any): void {
    // 将 token 的值记录在 store 中
    store.dispatch({
      type: "SET_USER",
      payload: user
    });
  }
 
  public getStateAll(): any {
    const state = store.getState();
    return {
      user: state.user || {},
      global: state.global || {},
    }
  }
  public getHeaderNav(): any {
    const state = store.getState();
    return state.headerNavList || "";
  }

  // 添加头部导航信息
  public setAddHeaderNav(nav: MenuItem): void {
    const state = store.getState();
    let headerNav = state.headerNavList || []
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
      headerNav.push(nav)
    }
    store.dispatch({
      type: "SET_HEADER_NAV",
      payload: headerNav
    });
  }
  // 设置头部导航信息
  public setHeaderNav(navList: MenuItem[]): void {
    store.dispatch({
      type: "SET_HEADER_NAV",
      payload: navList
    });
  }
}

const shared = new Shared();
export default shared;