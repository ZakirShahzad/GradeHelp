import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain,
  ThumbsUp,
  ThumbsDown,
  Edit3,
  Save,
  Send,
  FileText,
  CheckCircle,
  AlertTriangle,
  Target,
  TrendingUp
} from 'lucide-react';

interface GradingInterfaceProps {
  studentName?: string;
  assignmentTitle?: string;
}

export const GradingInterface: React.FC<GradingInterfaceProps> = ({
  studentName = "Sarah Martinez",
  assignmentTitle = "Essay: American Revolution Analysis"
}) => {
  const [currentGrade, setCurrentGrade] = useState([87]);
  const [feedback, setFeedback] = useState("Excellent analysis of the causes leading to the American Revolution. Your thesis statement is clear and well-supported by historical evidence. The essay demonstrates strong critical thinking skills and provides thoughtful connections between different historical events.");
  const [isEditing, setIsEditing] = useState(false);

  const aiSuggestions = {
    grade: 87,
    confidence: 94,
    reasoning: [
      "Strong thesis statement with clear argument structure",
      "Excellent use of primary source evidence",
      "Well-developed body paragraphs with smooth transitions",
      "Minor grammatical errors (-3 points)",
      "Could strengthen conclusion with broader implications"
    ],
    rubricBreakdown: [
      { category: "Thesis & Argument", score: 18, total: 20, feedback: "Clear, debatable thesis with strong positioning" },
      { category: "Evidence & Analysis", score: 22, total: 25, feedback: "Excellent use of primary sources, strong analysis" },
      { category: "Organization", score: 19, total: 20, feedback: "Logical flow, effective transitions" },
      { category: "Writing Mechanics", score: 17, total: 20, feedback: "Minor grammar issues, otherwise strong" },
      { category: "Creativity & Insight", score: 11, total: 15, feedback: "Good insights, could push analysis further" }
    ]
  };

  const improvementPlan = [
    "Review grammar rules for comma usage and sentence structure",
    "Expand conclusion to discuss broader historical implications",
    "Consider exploring counter-arguments to strengthen thesis",
    "Add more specific dates and statistics for stronger evidence"
  ];

  const totalScore = aiSuggestions.rubricBreakdown.reduce((sum, item) => sum + item.score, 0);
  const totalPossible = aiSuggestions.rubricBreakdown.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-surface-elevated border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{assignmentTitle}</h1>
              <p className="text-muted-foreground">Grading: {studentName}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Brain className="h-3 w-3" />
                <span>AI Confidence: {aiSuggestions.confidence}%</span>
              </Badge>
              <Button variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button variant="success">
                <Send className="mr-2 h-4 w-4" />
                Send to Student
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Work Preview */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Student Submission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-surface p-4 rounded-lg border border-border max-h-96 overflow-y-auto">
                  <p className="text-sm text-foreground leading-relaxed">
                    <strong>The American Revolution: A Fight for Liberty and Self-Determination</strong>
                  </p>
                  <br />
                  <p className="text-sm text-foreground leading-relaxed">
                    The American Revolution was not merely a conflict between Britain and its colonies, but a fundamental struggle for the principles of liberty, self-determination, and democratic governance. While multiple factors contributed to this watershed moment in history, the primary causes can be traced to British policies that violated colonists' rights as English citizens, economic exploitation through unfair taxation, and the colonists' evolving political consciousness.
                  </p>
                  <br />
                  <p className="text-sm text-foreground leading-relaxed">
                    The Stamp Act of 1765 marked a critical turning point in colonial-British relations. Unlike previous taxes that regulated trade, this act directly taxed colonists for legal documents, newspapers, and other paper goods. As John Adams later wrote, "The Revolution was in the minds and hearts of the people," highlighting how such policies awakened colonial resistance...
                  </p>
                  <div className="text-center text-muted-foreground text-sm mt-4">
                    [Document continues...]
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-primary" />
                  AI Analysis & Reasoning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-success-light rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-success mr-2" />
                      <span className="font-medium text-success-foreground">Strong Performance Detected</span>
                    </div>
                    <Badge variant="default">{aiSuggestions.confidence}% confident</Badge>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Key Strengths Identified:</h4>
                    <ul className="space-y-1">
                      {aiSuggestions.reasoning.slice(0, 3).map((reason, idx) => (
                        <li key={idx} className="flex items-center text-sm text-foreground">
                          <CheckCircle className="h-3 w-3 text-success mr-2 flex-shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Areas for Improvement:</h4>
                    <ul className="space-y-1">
                      {aiSuggestions.reasoning.slice(3).map((reason, idx) => (
                        <li key={idx} className="flex items-center text-sm text-foreground">
                          <AlertTriangle className="h-3 w-3 text-warning mr-2 flex-shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Grade Assignment */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-primary" />
                  Grade Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {currentGrade[0]}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    AI Suggested: {aiSuggestions.grade}%
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Adjust Grade</span>
                    <span>{currentGrade[0]}%</span>
                  </div>
                  <Slider
                    value={currentGrade}
                    onValueChange={setCurrentGrade}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentGrade([aiSuggestions.grade])}
                    className="flex-1"
                  >
                    <ThumbsUp className="mr-1 h-3 w-3" />
                    Accept AI
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <ThumbsDown className="mr-1 h-3 w-3" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Rubric Breakdown */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Rubric Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiSuggestions.rubricBreakdown.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{item.category}</span>
                        <span className="text-sm text-muted-foreground">{item.score}/{item.total}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary rounded-full h-2 transition-all duration-500"
                          style={{ width: `${(item.score / item.total) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{item.feedback}</p>
                    </div>
                  ))}
                  
                  <div className="pt-3 border-t border-border">
                    <div className="flex justify-between font-semibold">
                      <span>Total Score:</span>
                      <span>{totalScore}/{totalPossible}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student Improvement Plan */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                  Improvement Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {improvementPlan.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <div className="w-5 h-5 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-primary font-medium">{idx + 1}</span>
                      </div>
                      <p className="text-sm text-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feedback Section */}
        <Card className="card-elevated mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Edit3 className="mr-2 h-5 w-5 text-primary" />
                Feedback for Student
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Preview' : 'Edit'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write personalized feedback for the student..."
                className="min-h-[120px]"
              />
            ) : (
              <div className="bg-surface p-4 rounded-lg border border-border">
                <p className="text-sm text-foreground leading-relaxed">{feedback}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GradingInterface;