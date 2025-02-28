// src/components/InterviewQuestionsPage.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileQuestion } from "lucide-react";
import { toast } from "sonner";

// Define the interview question interface
interface InterviewQuestion {
  id: number;
  question: string;
  answer: string;
}

const InterviewQuestionsPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [jobTitle, setJobTitle] = useState<string>("");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);

  const generateQuestions = async () => {
    if (!jobTitle.trim()) {
      toast.error("Please enter a job title");
      return;
    }

    try {
      setLoading(true);

      // Call backend API to generate questions
      const response = await fetch("http://localhost:3000/api/generate-interview-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobTitle }),
      });

      if (!response.ok) throw new Error("Failed to generate questions");

      const result = await response.json();
      setQuestions(result.questions);

      toast.success("Interview questions generated successfully!");
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Interview Questions Generator
          </CardTitle>
          <p className="text-gray-600">
            Generate professional interview questions based on job title
          </p>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="job-title" className="text-gray-700 font-medium">
              Job Title
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="job-title"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Software Engineer"
                className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button
                onClick={generateQuestions}
                disabled={loading || !jobTitle.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileQuestion className="h-4 w-4" />
                    Generate Questions
                  </>
                )}
              </Button>
            </div>
          </div>

          {questions.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Generated Interview Questions
              </h3>
              <div className="space-y-4">
                {questions.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <p className="font-medium text-gray-800">
                      Q{item.id}: {item.question}
                    </p>
                    <p className="mt-2 text-gray-600">A: {item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewQuestionsPage;