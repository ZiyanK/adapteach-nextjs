'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Circle, Send, AlertCircle, Languages } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AssessmentQuestion {
  question: string;
  options?: string[];
  correct_answer?: string;
  rationale?: string;
  type?: 'mcq' | 'text';
}

interface AssessmentFormProps {
  questions: AssessmentQuestion[];
  onSubmit: (answers: Record<number, string>) => void;
  isSubmitting?: boolean;
}

export default function AssessmentForm({ questions, onSubmit, isSubmitting = false }: AssessmentFormProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number>(0);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleSubmit = () => {
    // Calculate score
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (question.correct_answer && answers[index] === question.correct_answer) {
        correctAnswers++;
      }
    });
    
    const calculatedScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(calculatedScore);
    setShowResults(true);
    
    // Call the parent onSubmit function
    onSubmit(answers);
  };

  const getQuestionType = (question: AssessmentQuestion): 'mcq' | 'text' => {
    if (question.type) return question.type;
    return question.options && question.options.length > 0 ? 'mcq' : 'text';
  };

  const isAnswerCorrect = (questionIndex: number): boolean => {
    const question = questions[questionIndex];
    return question.correct_answer ? answers[questionIndex] === question.correct_answer : false;
  };

  const isAnswerIncorrect = (questionIndex: number): boolean => {
    const question = questions[questionIndex];
    return question.correct_answer ? 
      Boolean(answers[questionIndex] && answers[questionIndex] !== question.correct_answer) : false;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      {/* Translate Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button 
          variant="outline" 
          size="sm" 
          disabled 
          className="flex items-center gap-2"
        >
          <Languages className="h-4 w-4" />
          Translate to Hindi
        </Button>
      </div>
      
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            Assessment
          </CardTitle>
          <p className="text-gray-600">
            Please answer all questions. You can review your answers before submitting.
          </p>
        </CardHeader>
      </Card>

      {/* Questions */}
      {questions.map((question, index) => (
        <Card key={index} className={`transition-all duration-200 ${
          showResults && isAnswerCorrect(index) ? 'ring-2 ring-green-200 bg-green-50' :
          showResults && isAnswerIncorrect(index) ? 'ring-2 ring-red-200 bg-red-50' :
          'hover:shadow-md'
        }`}>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Question */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Question {index + 1}
                </h3>
                <p className="text-gray-700 leading-relaxed">{question.question}</p>
              </div>

              {/* Answer Section */}
              <div className="space-y-3">
                {getQuestionType(question) === 'mcq' ? (
                  <RadioGroup
                    value={answers[index] || ''}
                    onValueChange={(value) => handleAnswerChange(index, value)}
                    disabled={showResults}
                  >
                    {question.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={option} 
                          id={`question-${index}-option-${optionIndex}`}
                          className={showResults ? 'cursor-default' : ''}
                        />
                        <Label 
                          htmlFor={`question-${index}-option-${optionIndex}`}
                          className={`flex-1 cursor-pointer ${
                            showResults && option === question.correct_answer 
                              ? 'text-green-700 font-medium' 
                              : showResults && option === answers[index] && option !== question.correct_answer
                              ? 'text-red-700 font-medium'
                              : ''
                          }`}
                        >
                          {option}
                        </Label>
                        {showResults && option === question.correct_answer && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        {showResults && option === answers[index] && option !== question.correct_answer && (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor={`question-${index}`}>Your Answer:</Label>
                    <Textarea
                      id={`question-${index}`}
                      value={answers[index] || ''}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      placeholder="Type your answer here..."
                      className="min-h-[100px]"
                      disabled={showResults}
                    />
                  </div>
                )}

                {/* Rationale (shown after submission) */}
                {showResults && question.rationale && (
                  <Alert className={`mt-4 ${
                    isAnswerCorrect(index) ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}>
                    <AlertCircle className={`h-4 w-4 ${
                      isAnswerCorrect(index) ? 'text-green-600' : 'text-red-600'
                    }`} />
                    <AlertDescription className={`${
                      isAnswerCorrect(index) ? 'text-green-800' : 'text-red-800'
                    }`}>
                      <strong>Explanation:</strong> {question.rationale}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Results Summary */}
      {showResults && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">
                Assessment Complete!
              </h3>
              <p className="text-blue-700 mb-4">
                Your score: <span className="font-bold text-2xl">{score}%</span>
              </p>
              <p className="text-blue-600">
                {score >= 80 ? 'Excellent work!' : 
                 score >= 60 ? 'Good job! Keep practicing.' : 
                 'Keep studying and try again!'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      {!showResults && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || Object.keys(answers).length < questions.length}
            className="px-8 py-3 text-lg"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Assessment
              </>
            )}
          </Button>
        </div>
      )}

      {/* Progress Indicator */}
      {!showResults && (
        <div className="text-center text-sm text-gray-500">
          {Object.keys(answers).length} of {questions.length} questions answered
        </div>
      )}
    </div>
  );
} 