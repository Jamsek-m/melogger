-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Gostitelj: 127.0.0.1
-- Čas nastanka: 22. jan 2017 ob 00.32
-- Različica strežnika: 10.1.10-MariaDB
-- Različica PHP: 5.6.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Zbirka podatkov: `me_logger`
--

-- --------------------------------------------------------

--
-- Struktura tabele `citizen`
--

CREATE TABLE `citizen` (
  `CITIZEN_ID` int(11) NOT NULL,
  `CITIZEN_NAME` varchar(100) COLLATE utf8_slovenian_ci NOT NULL,
  `STR` int(11) NOT NULL,
  `DEX` int(11) NOT NULL,
  `INTL` int(11) NOT NULL,
  `CON` int(11) NOT NULL,
  `CHR` int(11) NOT NULL,
  `STATUS` char(1) COLLATE utf8_slovenian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_slovenian_ci;

--
-- Odloži podatke za tabelo `citizen`
--



-- --------------------------------------------------------

--
-- Struktura tabele `donacija`
--

CREATE TABLE `donacija` (
  `ID_DONACIJE` int(11) NOT NULL,
  `RESURS` int(11) NOT NULL,
  `KOLICINA` int(11) NOT NULL,
  `CITIZEN` int(11) NOT NULL,
  `DATUM_VNOSA` datetime NOT NULL,
  `VNESEL_USER` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_slovenian_ci;

--
-- Odloži podatke za tabelo `donacija`
--


-- --------------------------------------------------------

--
-- Struktura tabele `sif_res`
--

CREATE TABLE `sif_res` (
  `RES_ID` int(11) NOT NULL,
  `NAZIV` varchar(50) COLLATE utf8_slovenian_ci NOT NULL,
  `MON_VAL` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_slovenian_ci;

--
-- Odloži podatke za tabelo `sif_res`
--



-- --------------------------------------------------------

--
-- Struktura tabele `user`
--

CREATE TABLE `user` (
  `USER_ID` int(11) NOT NULL,
  `USERNAME` varchar(100) COLLATE utf8_slovenian_ci NOT NULL,
  `PASSWORD` varchar(200) COLLATE utf8_slovenian_ci NOT NULL,
  `TIP` char(1) COLLATE utf8_slovenian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_slovenian_ci;

--
-- Odloži podatke za tabelo `user`
--

INSERT INTO `user` (`USER_ID`, `USERNAME`, `PASSWORD`, `TIP`) VALUES
(1, 'jerman', '2501637ef529ba28ba048ac8349cfe6b089bc45a5d77a253e7b31364b82118dd', 'A');


--
-- Indeksi zavrženih tabel
--

--
-- Indeksi tabele `citizen`
--
ALTER TABLE `citizen`
  ADD PRIMARY KEY (`CITIZEN_ID`);

--
-- Indeksi tabele `donacija`
--
ALTER TABLE `donacija`
  ADD PRIMARY KEY (`ID_DONACIJE`),
  ADD KEY `fk_res` (`RESURS`),
  ADD KEY `fk_cit` (`CITIZEN`),
  ADD KEY `fk_usr` (`VNESEL_USER`);

--
-- Indeksi tabele `sif_res`
--
ALTER TABLE `sif_res`
  ADD PRIMARY KEY (`RES_ID`);

--
-- Indeksi tabele `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`USER_ID`);

--
-- AUTO_INCREMENT zavrženih tabel
--

--
-- AUTO_INCREMENT tabele `citizen`
--
ALTER TABLE `citizen`
  MODIFY `CITIZEN_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT tabele `donacija`
--
ALTER TABLE `donacija`
  MODIFY `ID_DONACIJE` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT tabele `sif_res`
--
ALTER TABLE `sif_res`
  MODIFY `RES_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=351;
--
-- AUTO_INCREMENT tabele `user`
--
ALTER TABLE `user`
  MODIFY `USER_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- Omejitve tabel za povzetek stanja
--

--
-- Omejitve za tabelo `donacija`
--
ALTER TABLE `donacija`
  ADD CONSTRAINT `donacija_ibfk_1` FOREIGN KEY (`CITIZEN`) REFERENCES `citizen` (`CITIZEN_ID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `donacija_ibfk_2` FOREIGN KEY (`VNESEL_USER`) REFERENCES `user` (`USER_ID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `donacija_ibfk_3` FOREIGN KEY (`RESURS`) REFERENCES `sif_res` (`RES_ID`) ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
