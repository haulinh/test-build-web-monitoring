import styled from 'styled-components'

export const SIDEBAR_GLOBAL_WIDTH = 64

export const SidebarGlobal = {
  Wrapper: styled.div`
    background: linear-gradient(
      135deg,
      rgb(29, 137, 206) 0%,
      rgb(86, 210, 243) 100%
    );
    padding: 16px 0 16px;
    width: ${SIDEBAR_GLOBAL_WIDTH}px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    position: fixed;
    left: 0px;
    right: 0px;
    z-index: 100;
  `,
  Line: styled.div`
    height: 1px;
    width: 90%;
    display: block;
    margin: 16px auto;
    background: #fff;
    opacity: 0.1;
  `,
  SidebarTop: styled.div`
    display: flex;
    flex-direction: column;
    a.logo img {
      width: 35px;
      height: auto;
    }
  `,
  SidebarBottom: styled.div`
    display: flex;
    flex-direction: column;
  `,
}
