-- phpMyAdmin SQL Dump
-- version 4.0.6
-- http://www.phpmyadmin.net
--
-- 主机: 127.0.0.1
-- 生成日期: 2013-10-02 10:40:11
-- 服务器版本: 5.5.33
-- PHP 版本: 5.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `db_wailian`
--

-- --------------------------------------------------------

--
-- 表的结构 `tb_qy`
--

CREATE TABLE IF NOT EXISTS `tb_qy` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `region` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `create_userId` int(8) NOT NULL,
  `description` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- 转存表中的数据 `tb_qy`
--

INSERT INTO `tb_qy` (`id`, `name`, `region`, `create_userId`, `description`) VALUES
(2, '阿里巴巴', '浙江省杭州市', 1, '一家大型的电子商务公司');

-- --------------------------------------------------------

--
-- 表的结构 `tb_qyneed`
--

CREATE TABLE IF NOT EXISTS `tb_qyneed` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `qy_id` int(8) NOT NULL,
  `title` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `publisher_id` int(8) NOT NULL,
  `publish_date` datetime NOT NULL,
  `click_nums` int(8) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `tb_qy_act_st`
--

CREATE TABLE IF NOT EXISTS `tb_qy_act_st` (
  `qy_id` int(8) NOT NULL,
  `st_id` int(8) NOT NULL,
  PRIMARY KEY (`qy_id`,`st_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `tb_st`
--

CREATE TABLE IF NOT EXISTS `tb_st` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `createUser_id` int(8) NOT NULL,
  `leader_id` int(8) NOT NULL,
  `region` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `create_Time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `tb_stneed`
--

CREATE TABLE IF NOT EXISTS `tb_stneed` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `st_id` int(8) NOT NULL,
  `title` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `publisher_id` int(8) NOT NULL,
  `publish_date` datetime NOT NULL,
  `click_nums` int(8) NOT NULL,
  `money` int(8) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `tb_st_act_qy`
--

CREATE TABLE IF NOT EXISTS `tb_st_act_qy` (
  `st_id` int(8) NOT NULL,
  `qyact_id` int(8) NOT NULL,
  PRIMARY KEY (`st_id`,`qyact_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `tb_user`
--

CREATE TABLE IF NOT EXISTS `tb_user` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `login_name` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `true_name` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `sex` tinyint(1) NOT NULL,
  `address` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `phone` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `register_date` datetime NOT NULL,
  `recentlogin_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `tb_user`
--

INSERT INTO `tb_user` (`id`, `login_name`, `true_name`, `sex`, `address`, `phone`, `register_date`, `recentlogin_date`) VALUES
(1, 'pypy_2008@126.com', 'py', 0, '北京市昌平区', '123142135', '2013-10-01 00:00:00', '2013-10-02 00:00:00');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
