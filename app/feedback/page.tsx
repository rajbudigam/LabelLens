'use client';

import { useState } from 'react';

interface FeedbackForm {
  type: 'bug' | 'feature' | 'improvement' | 'praise' | 'question';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  steps?: string;
  expected?: string;
  actual?: string;
  email?: string;
  allowContact: boolean;
  ingredients?: string;
  category?: string;
}

const FEEDBACK_TYPES = [
  { value: 'bug', label: 'Bug Report', icon: '🐛', description: 'Report an error or unexpected behavior' },
  { value: 'feature', label: 'Feature Request', icon: 'TIP', description: 'Suggest a new feature or capability' },
  { value: 'improvement', label: 'Improvement', icon: '⚡', description: 'Suggest improvements to existing features' },
  { value: 'praise', label: 'Praise', icon: '+', description: 'Share positive feedback or appreciation' },
  { value: 'question', label: 'Question', icon: '❓', description: 'Ask a question about LabelLens' }
];

const CATEGORIES = [
  'Analysis Accuracy',
  'User Interface',
  'Performance',
  'Mobile Experience',
  'Accessibility',
  'Data Export',
  'Regulatory Information',
  'NOVA Classification',
  'Additive Database',
  'Allergen Detection',
  'Other'
];

export default function FeedbackPage() {
  const [form, setForm] = useState<FeedbackForm>({
    type: 'improvement',
    priority: 'medium',
    title: '',
    description: '',
    allowContact: false
  });
  
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [showThankYou, setShowThankYou] = useState(false);

  const updateForm = (updates: Partial<FeedbackForm>) => {
    setForm(prev => ({ ...prev, ...updates }));
  };

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('submitting');

    try {
      // Simulate API call - in real app, this would go to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store feedback locally for demo purposes
      const feedback = {
        ...form,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      const existingFeedback = JSON.parse(localStorage.getItem('labelLensFeedback') || '[]');
      localStorage.setItem('labelLensFeedback', JSON.stringify([...existingFeedback, feedback]));
      
      setSubmitStatus('success');
      setShowThankYou(true);
      
      // Reset form
      setForm({
        type: 'improvement',
        priority: 'medium',
        title: '',
        description: '',
        allowContact: false
      });
      
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  const isValid = form.title.trim() && form.description.trim();

  if (showThankYou) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="text-6xl mb-6">🙏</div>
        <h1 className="text-3xl font-bold text-white mb-4">Thank You!</h1>
        <p className="text-slate-400 mb-6">
          Your feedback has been submitted successfully. We read every piece of feedback 
          and use it to make LabelLens better.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => setShowThankYou(false)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
          >
            Submit More Feedback
          </button>
          <div>
            <a 
              href="/" 
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to Analysis
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Share Your Feedback</h1>
        <p className="text-slate-400">
          Help us improve LabelLens! Your feedback drives our development priorities 
          and helps us build better food analysis tools.
        </p>
      </div>

      <form onSubmit={submitFeedback} className="space-y-8">
        {/* Feedback Type */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">What type of feedback is this?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {FEEDBACK_TYPES.map((type) => (
              <label
                key={type.value}
                className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  form.type === type.value
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={type.value}
                  checked={form.type === type.value}
                  onChange={(e) => updateForm({ type: e.target.value as any })}
                  className="sr-only"
                />
                <div className="text-2xl mr-3">{type.icon}</div>
                <div>
                  <div className="font-semibold text-white">{type.label}</div>
                  <div className="text-sm text-slate-400">{type.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Priority Level</h2>
          <div className="grid grid-cols-4 gap-4">
            {(['low', 'medium', 'high', 'critical'] as const).map((priority) => (
              <label
                key={priority}
                className={`flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-all ${
                  form.priority === priority
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value={priority}
                  checked={form.priority === priority}
                  onChange={(e) => updateForm({ priority: e.target.value as any })}
                  className="sr-only"
                />
                <div className="text-lg mb-1">
                  {priority === 'low' && '🟢'}
                  {priority === 'medium' && '🟡'}
                  {priority === 'high' && '🟠'}
                  {priority === 'critical' && '🔴'}
                </div>
                <div className="text-white font-medium capitalize">{priority}</div>
              </label>
            ))}
          </div>
        </div>

        {/* Category (for bugs and improvements) */}
        {(form.type === 'bug' || form.type === 'improvement') && (
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Category</h2>
            <select
              value={form.category || ''}
              onChange={(e) => updateForm({ category: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category...</option>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        )}

        {/* Title and Description */}
        <div className="bg-slate-800 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white">Details</h2>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => updateForm({ title: e.target.value })}
              placeholder={
                form.type === 'bug' ? 'Briefly describe the bug...' :
                form.type === 'feature' ? 'What feature would you like?' :
                'Give your feedback a clear title...'
              }
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => updateForm({ description: e.target.value })}
              placeholder={
                form.type === 'bug' ? 'What happened? What did you expect to happen? Please provide as much detail as possible...' :
                form.type === 'feature' ? 'Describe the feature you\'d like to see. How would it work? What problem would it solve?' :
                form.type === 'improvement' ? 'What could be improved? How would you like it to work differently?' :
                'Share your thoughts, questions, or feedback...'
              }
              rows={6}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Bug-specific fields */}
        {form.type === 'bug' && (
          <div className="bg-slate-800 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white">Bug Details</h2>
            
            <div>
              <label htmlFor="steps" className="block text-sm font-medium text-slate-300 mb-2">
                Steps to Reproduce
              </label>
              <textarea
                id="steps"
                value={form.steps || ''}
                onChange={(e) => updateForm({ steps: e.target.value })}
                placeholder="1. Go to...&#10;2. Click on...&#10;3. See error"
                rows={4}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="expected" className="block text-sm font-medium text-slate-300 mb-2">
                  Expected Behavior
                </label>
                <textarea
                  id="expected"
                  value={form.expected || ''}
                  onChange={(e) => updateForm({ expected: e.target.value })}
                  placeholder="What should have happened?"
                  rows={3}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="actual" className="block text-sm font-medium text-slate-300 mb-2">
                  Actual Behavior
                </label>
                <textarea
                  id="actual"
                  value={form.actual || ''}
                  onChange={(e) => updateForm({ actual: e.target.value })}
                  placeholder="What actually happened?"
                  rows={3}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="ingredients" className="block text-sm font-medium text-slate-300 mb-2">
                Ingredient Text (if applicable)
              </label>
              <textarea
                id="ingredients"
                value={form.ingredients || ''}
                onChange={(e) => updateForm({ ingredients: e.target.value })}
                placeholder="If this bug is related to specific ingredients, paste them here..."
                rows={3}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="bg-slate-800 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white">Contact Information</h2>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email (Optional)
            </label>
            <input
              id="email"
              type="email"
              value={form.email || ''}
              onChange={(e) => updateForm({ email: e.target.value })}
              placeholder="your@email.com"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <label className="flex items-start">
            <input
              type="checkbox"
              checked={form.allowContact}
              onChange={(e) => updateForm({ allowContact: e.target.checked })}
              className="mt-1 mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <div>
              <div className="text-white font-medium">Allow follow-up contact</div>
              <div className="text-slate-400 text-sm">
                We may reach out for clarification or to let you know when your feedback is addressed.
              </div>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="text-slate-400 text-sm">
              * Required fields
            </div>
            <button
              type="submit"
              disabled={!isValid || submitStatus === 'submitting'}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                isValid && submitStatus !== 'submitting'
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-slate-600 text-slate-400 cursor-not-allowed'
              }`}
            >
              {submitStatus === 'submitting' && '⏳ Submitting...'}
              {submitStatus === 'error' && '[ERROR] Failed - Try Again'}
              {submitStatus === 'idle' && '📤 Submit Feedback'}
            </button>
          </div>

          {submitStatus === 'error' && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded-lg">
              <div className="text-red-400 text-sm">
                Failed to submit feedback. Please try again or email us directly.
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Privacy Note */}
      <div className="mt-8 p-4 bg-slate-800/50 rounded-lg">
        <div className="text-slate-400 text-sm">
          <strong>Privacy:</strong> We take your privacy seriously. Feedback is stored securely 
          and used only to improve LabelLens. We never share personal information with third parties. 
          Technical details like browser information help us debug issues.
        </div>
      </div>
    </div>
  );
}
