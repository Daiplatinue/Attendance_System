import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { MeetingFormData, MeetingFormProps } from "@/sections/componentStyles/types/meeting";
import { SelectField } from "./form-fields/select-field";
import { InputField } from "./form-fields/input-field";
import { TextareaField } from "./form-fields/textarea-field";

export const MeetingForm = ({ onSubmit, teachers, students }: MeetingFormProps) => {
  const [formData, setFormData] = useState<MeetingFormData>({
    subject: "",
    date: "",
    time: "",
    description: "",
    teacherId: 0,
    studentId: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SelectField
        label="Teacher"
        name="teacherId"
        value={formData.teacherId.toString()}
        onChange={(value) => handleSelectChange("teacherId", value)}
        options={teachers}
        placeholder="Select Teacher"
      />

      <SelectField
        label="Student"
        name="studentId"
        value={formData.studentId.toString()}
        onChange={(value) => handleSelectChange("studentId", value)}
        options={students}
        placeholder="Select Student"
      />

      <InputField
        label="Subject"
        name="subject"
        type="text"
        value={formData.subject}
        onChange={handleInputChange}
        required
      />

      <InputField
        label="Date"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleInputChange}
        required
      />

      <InputField
        label="Time"
        name="time"
        type="time"
        value={formData.time}
        onChange={handleInputChange}
        required
      />

      <TextareaField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        required
      />

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
};