import { useState, useEffect } from "react";
import api from "../../../utils/api";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

export default function ExpoForm({ expo, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    boothStart: "",
    boothEnd: "",
  });

  useEffect(() => {
    if (expo) {
      setForm({
        name: expo.name || "",
        location: expo.location || "",
        startDate: expo.startDate?.substring(0, 10) || "",
        endDate: expo.endDate?.substring(0, 10) || "",
        description: expo.description || "",
        boothStart: expo.boothStart || "",
        boothEnd: expo.boothEnd || "",
      });
    }
  }, [expo]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, location, startDate, endDate, boothStart, boothEnd } = form;
    if (!name || !location || !startDate || !endDate || !boothStart || !boothEnd) {
      alert("Please fill all required fields including booth range");
      return;
    }

    if (expo) await api.put(`/expos/${expo._id}`, form);
    else await api.post("/expos", form);

    console.log('ok');
    

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
      <Input label="Location" name="location" value={form.location} onChange={handleChange} required />
      <Input label="Start Date" type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
      <Input label="End Date" type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
      <Input label="Description" name="description" value={form.description} onChange={handleChange} />
      <div className="flex gap-4 w-full">
        <Input label="Booth Start" type="number" name="boothStart" value={form.boothStart} onChange={handleChange} required />
        <Input label="Booth End" type="number" name="boothEnd" value={form.boothEnd} onChange={handleChange} required />
      </div>
      <div className="text-right">
        <Button type="submit">{expo ? "Update Expo" : "Create Expo"}</Button>
      </div>
    </form>
  );
}
