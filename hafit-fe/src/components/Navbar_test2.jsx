import React, { useEffect } from "react";
import { Menu, Button } from "antd";
import { Link } from "react-router-dom";

import $ from 'jquery';
import 'magnific-popup';
import 'owl.carousel';
import 'swiper';
import 'aos';
import 'lightgallery';

import '../styles/template/bootstrap.min.css';
import '../styles/template/magnific-popup.css';
import '../styles/template/owl.carousel.css';
import '../styles/template/owl.theme.default.css';
import '../styles/template/swiper-bundle.css';
import '../styles/template/aos.css';
import '../styles/template/lightgallery.css';
import '../styles/template/style.css';

import "../styles/navbar.css";

import Logo from "../assets/img/testlogo.jpg";

const NavbarTest2 = () => {

  useEffect(() => {
    $('#lightgallery').lightGallery();
  }, [])

  return (
    <header className="site-navbar py-3" role="banner" style={{ borderBottom: "1px solid lightgray", marginBottom: "1rem" }}>
      <div className="container-fluid">
        <div className="row align-items-center">

          <div className="col-6 col-xl-2" data-aos="fade-down">
            <h1 className="mb-0"><Link to="/" className="text-black h2 mb-0">Hafit{{Logo}}</Link></h1>
          </div>

          <div className="col-10 col-md-8 d-none d-xl-block" data-aos="fade-down">
            <nav className="site-navigation position-relative text-right text-lg-center" role="navigation">
              <Menu mode="horizontal" defaultSelectedKeys={['home']}>
                <Menu.Item key="home"><Link to="/intro">소개</Link></Menu.Item>
                <Menu.Item><Link to="/notice" style={{ fontWeight: 500, fontSize: "16px" }}>공지사항</Link></Menu.Item>
                <Menu.Item><Link to="#" style={{ fontWeight: 500, fontSize: "17px" }}>주문제작사례</Link></Menu.Item>
                <Menu.Item><Link to="#" style={{ fontWeight: 500, fontSize: "17px" }}>고객센터</Link></Menu.Item>
              </Menu>
            </nav>
          </div>

          <div className="col-6 col-xl-2 text-right" data-aos="fade-down">
            <div className="d-none d-xl-inline-block">
              <ul className="site-menu js-clone-nav ml-auto list-unstyled d-flex text-right" data-class="social" style={{ fontSize: "18px" }}>
                <li><Link to="/join">회원가입</Link></li>
                <li style={{ marginLeft: "1rem" }}><Link to="/login">로그인</Link></li>
              </ul>
            </div>

            <div className="d-inline-block d-xl-none ml-md-0 mr-auto py-3" style={{ position: "relative", top: "3px" }}>
              <Button type="text" className="site-menu-toggle js-menu-toggle text-black">
                <span className="icon-menu h3"></span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavbarTest2;
