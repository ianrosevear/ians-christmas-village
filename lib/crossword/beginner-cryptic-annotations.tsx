import React from "react";
import { Def, Ind, Fod, Cha } from "./annotations";

type AnnotationRenderer = (show: boolean) => React.ReactNode;

const annotations: Record<string, AnnotationRenderer> = {
  // Across
  "1A": (s) => (
    <>
      <Def show={s}>Put down</Def> <Def show={s}>specific location</Def>
    </>
  ),
  "5A": (s) => (
    <>
      <Ind show={s}>Endless</Ind> <Fod show={s}>woof</Fod> leads to <Def show={s}>court</Def>
    </>
  ),
  "6A": (s) => (
    <>
      <Def show={s}>Long ago, you</Def> <Ind show={s}>embraced</Ind>{" "}
      <Fod show={s}>my</Fod> <Ind show={s}>first</Ind> <Cha show={s}>recurring idea</Cha>
    </>
  ),
  "8A": (s) => (
    <>
      <Def show={s}>Horses</Def> <Cha show={s}>are</Cha> <Ind show={s}>in</Ind>{" "}
      <Fod show={s}>Mississippi</Fod>
    </>
  ),
  "10A": (s) => (
    <>
      <Def show={s}>Company captain</Def> <Ind show={s}>in</Ind>{" "}
      <Fod show={s}>space opera</Fod>
    </>
  ),
  "11A": (s) => (
    <>
      <Ind show={s}>Untidy</Ind> <Fod show={s}>beard</Fod>—<Def show={s}>it has a crust</Def>
    </>
  ),

  // Down
  "1D": (s) => (
    <>
      <Def show={s}>Good fortune</Def> <Ind show={s}>follows</Ind>{" "}
      <Cha show={s}>dope</Cha> <Cha show={s}>dinner party</Cha>
    </>
  ),
  "2D": (s) => (
    <>
      <Def show={s}>Had some food</Def> with <Fod show={s}>ETA</Fod>{" "}
      <Ind show={s}>coming up</Ind>
    </>
  ),
  "3D": (s) => (
    <>
      <Def show={s}>Sheep</Def> <Ind show={s}>heard</Ind> <Fod show={s}>you</Fod>
    </>
  ),
  "4D": (s) => (
    <>
      <Fod show={s}>Indiana</Fod> <Cha show={s}>led</Cha>{" "}
      <Ind show={s}>without head</Ind>, <Def show={s}>wanted it bad</Def>
    </>
  ),
  "7D": (s) => (
    <>
      <Fod show={s}>Mamma&apos;s</Fod> <Ind show={s}>odd</Ind>{" "}
      <Def show={s}>combat sport</Def>
    </>
  ),
  "8D": (s) => (
    <>
      <Fod show={s}>Ammo bandit</Fod> <Ind show={s}>harbored</Ind>{" "}
      <Def show={s}>group of criminals</Def>
    </>
  ),
  "9D": (s) => (
    <>
      <Fod show={s}>Oriole</Fod> <Ind show={s}>regularly</Ind> makes{" "}
      <Def show={s}>eggs</Def>
    </>
  ),
};

export default annotations;
