import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import * as XLSX from "xlsx";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Student } from "@/sections/componentStyles/types/teacher";
import { useAttendanceStore } from '@/sections/componentStyles/types/attendanceStore';

interface ImportStudentsDialogProps {
  onImport: (students: Student[]) => void;
}

export function ImportStudentsDialog({ onImport }: ImportStudentsDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const { setStudents } = useAttendanceStore();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError("");

    if (file) {
      setFileName(file.name);
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as Array<any>;

          if (jsonData.length < 2) {
            setError("Excel file must contain a header row and at least one data row.");
            return;
          }

          const headers: string[] = jsonData[0].map((header: any) => header?.toString().trim().toUpperCase());
          const idColumnIndex = headers.findIndex((h: string) => h === "ID");
          const nameColumnIndex = headers.findIndex((h: string) => h === "NAME");

          if (idColumnIndex === -1 || nameColumnIndex === -1) {
            setError('Excel file must contain columns labeled "ID" and "NAME".');
            return;
          }

          const formattedData = jsonData.slice(1)
            .filter(row => row.length > Math.max(idColumnIndex, nameColumnIndex))
            .map((row, index) => {
              const id = row[idColumnIndex]?.toString().trim();
              const name = row[nameColumnIndex]?.toString().trim();

              if (!id || !name) {
                throw new Error(`Row ${index + 2} contains missing or invalid ID or Name.`);
              }

              return { id, name, dropped: false };
            });

          if (formattedData.length === 0) {
            setError("No valid data found in the Excel file.");
            return;
          }

          setStudents(formattedData);
          onImport(formattedData);
          setOpen(false);
          setFileName("");
          if (event.target) event.target.value = "";
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to process Excel file.");
        }
      };

      reader.onerror = () => {
        setError("Failed to read the Excel file.");
      };

      reader.readAsBinaryString(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (
      file &&
      (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel")
    ) {
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
        handleFileUpload({ target: fileInputRef.current } as React.ChangeEvent<HTMLInputElement>);
      }
    } else {
      setError("Please upload an Excel file (.xlsx or .xls).");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Import Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-modalColor border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
            Import Students from Excel
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-emerald-500/50 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx,.xls"
              className="hidden"
            />
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-emerald-500/20 rounded-full">
                  <Upload className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
              <div>
                <p className="text-lg font-medium">{fileName || "Drop your Excel file here"}</p>
                <p className="text-sm text-gray-400 mt-1">or click to browse</p>
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="gap-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-emerald-500/20"
              >
                <Upload className="h-4 w-4" />
                Choose File
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg bg-gray-800/50 p-4">
            <h4 className="text-sm font-medium mb-2">Excel File Requirements:</h4>
            <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
              <li>File must be .xlsx or .xls format</li>
              <li>First row must contain column headers "ID" and "NAME"</li>
              <li>Each row must have both ID and Name values</li>
              <li>
                Sample format:
                <pre className="mt-2 p-2 bg-black/30 rounded-md overflow-x-auto">
                  ID NAME 1 A 2 B 3 C
                </pre>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
