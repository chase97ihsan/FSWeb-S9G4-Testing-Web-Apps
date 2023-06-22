import React from "react";
import {
  getByLabelText,
  getByPlaceholderText,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";

test("hata olmadan render ediliyor", async () => {
  render(<IletisimFormu />);
});

test("iletişim formu headerı render ediliyor", () => {
  const { getByTestId, debug, screen } = render(<IletisimFormu />);
  const ıletisimFormuh1 = getByTestId("form-h1");
  expect(ıletisimFormuh1).toBeInTheDocument();
  expect(ıletisimFormuh1).toHaveTextContent("İletişim Formu");
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<IletisimFormu />);
  const ad =
    screen.getByLabelText("Ad*"); /*or screen.getByPlaceholderText("İlhan")*/
  userEvent.type(ad, "ihsa");
  const err = await screen.findAllByTestId("error");
  expect(err).toHaveLength(1);
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const button = screen.getByRole("button");
  userEvent.click(button);
  const err = await screen.findAllByTestId("error");
  expect(err).toHaveLength(3);
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const ad = screen.getByLabelText("Ad*");
  userEvent.type(ad, "ihsan");
  const soyad = screen.getByPlaceholderText("Mansız");
  userEvent.type(soyad, "doğan");
  const button = screen.getByRole("button");
  userEvent.click(button);
  const err = screen.getAllByTestId("error");
  expect(err).toHaveLength(1);
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const email = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
  userEvent.type(email, "dsdfgf");
  const err = await screen.findByText(
    /email geçerli bir email adresi olmalıdır./i
  );
  expect(err).toBeInTheDocument();
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const ad = screen.getByLabelText("Ad*");
  userEvent.type(ad, "ihsan");
  const email = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
  userEvent.type(email, "i@gmail.com");
  const button = screen.getByRole("button");
  userEvent.click(button);
  const err = await screen.findByText(/soyad gereklidir./i);
  expect(err).toBeInTheDocument();
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<IletisimFormu />);
  const ad = screen.getByLabelText("Ad*");
  userEvent.type(ad, "ihsan");
  const email = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
  userEvent.type(email, "i@gmail.com");
  const soyad = screen.getByPlaceholderText("Mansız");
  userEvent.type(soyad, "doğan");
  const button = screen.getByRole("button");
  userEvent.click(button);
  const message = screen.queryByTestId("messageDisplay");
  expect(message).not.toBeInTheDocument();
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  render(<IletisimFormu />);
  const ad = screen.getByLabelText("Ad*");
  userEvent.type(ad, "ihsan");
  const email = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
  userEvent.type(email, "i@gmail.com");
  const soyad = screen.getByPlaceholderText("Mansız");
  userEvent.type(soyad, "doğan");
  const message = screen.getByLabelText("Mesaj");
  userEvent.type(message, "not");
  const button = screen.getByRole("button");
  userEvent.click(button);

  const mesaj = screen.queryByTestId("messageDisplay");
  expect(mesaj).toBeInTheDocument();
  const firstName = screen.queryByTestId("firstnameDisplay");
  expect(firstName).toBeInTheDocument();
  const lastName = screen.queryByTestId("lastnameDisplay");
  expect(lastName).toBeInTheDocument();
  const emaill = screen.queryByTestId("emailDisplay");
  expect(email).toBeInTheDocument();
});
