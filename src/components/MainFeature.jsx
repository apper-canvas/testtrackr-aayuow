import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from '../utils/iconUtils';
import { captureScreenshot } from '../utils/screenshotUtils';

function MainFeature() {
  // Define icon components
  const PlusIcon = getIcon('Plus');
  const TrashIcon = getIcon('Trash2');
  const CheckCircleIcon = getIcon('CheckCircle');
  const XCircleIcon = getIcon('XCircle');
  const PlusCircleIcon = getIcon('PlusCircle');
  const SaveIcon = getIcon('Save');
  const AlertCircleIcon = getIcon('AlertCircle');
  const InfoIcon = getIcon('Info');
  const ChevronDownIcon = getIcon('ChevronDown');
  const CameraIcon = getIcon('Camera');
  const XIcon = getIcon('X');
  const ChevronUpIcon = getIcon('ChevronUp');

  // Initialize form state
  const [testCaseForm, setTestCaseForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    prerequisites: '',
    tags: [],
    steps: [
      { id: 1, description: '', expectedResult: '', screenshot: null }
    ]
  });

  // Form validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [expandedSteps, setExpandedSteps] = useState([]);
  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestCaseForm({
      ...testCaseForm,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Toggle step expansion
  const toggleStepExpansion = (stepId) => {
    if (expandedSteps.includes(stepId)) {
      setExpandedSteps(expandedSteps.filter(id => id !== stepId));
    } else {
      setExpandedSteps([...expandedSteps, stepId]);
    }
  };

  // Handle step changes
  const handleStepChange = (id, field, value) => {
    const updatedSteps = testCaseForm.steps.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    );
    
    setTestCaseForm({
      ...testCaseForm,
      steps: updatedSteps
    });
    
    // Clear step errors if they exist
    if (errors.steps && errors.steps[id] && errors.steps[id][field]) {
      const updatedStepErrors = { ...errors.steps };
      delete updatedStepErrors[id][field];
      setErrors({
        ...errors,
        steps: updatedStepErrors
      });
    }
  };
  // Handle screenshot capture for a step
  const handleScreenshotCapture = async (stepId) => {
    setIsCapturingScreenshot(true);
    
    try {
      const screenshot = await captureScreenshot();
      
      if (screenshot && screenshot.error) {
        toast.error(screenshot.error, {
          position: "bottom-right",
          autoClose: 4000
        });
        setIsCapturingScreenshot(false);
        return;
      }
      
      const updatedSteps = testCaseForm.steps.map(step => 
        step.id === stepId ? { ...step, screenshot } : step
      );
      
      setTestCaseForm({ ...testCaseForm, steps: updatedSteps });
      toast.success("Screenshot captured successfully!", {
        position: "bottom-right",
        autoClose: 2000
      });
    } finally {
      setIsCapturingScreenshot(false);
    }
  };


  // Add a new test step
  const addStep = () => {
    const newId = testCaseForm.steps.length > 0 
      ? Math.max(...testCaseForm.steps.map(step => step.id)) + 1
      : 1;
      
    setTestCaseForm({
      ...testCaseForm,
      steps: [
        ...testCaseForm.steps,
        { id: newId, description: '', expectedResult: '', screenshot: null }
      ]
    });
    
    // Automatically expand the new step
    setExpandedSteps([...expandedSteps, newId]);
    
    // Scroll to the new step after it's rendered
    setTimeout(() => {
      const newStepElement = document.getElementById(`step-${newId}`);
      if (newStepElement) {
        newStepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Remove a test step
  const removeStep = (id) => {
    if (testCaseForm.steps.length <= 1) {
      toast.error("Test case must have at least one step", {
        position: "bottom-right",
        autoClose: 3000
      });
      return;
    }
    
    setTestCaseForm({
      ...testCaseForm,
      steps: testCaseForm.steps.filter(step => step.id !== id)
    });
    
    // Remove from expanded steps if present
    if (expandedSteps.includes(id)) {
      setExpandedSteps(expandedSteps.filter(stepId => stepId !== id));
    }
    
    // Clear any errors for this step
    if (errors.steps && errors.steps[id]) {
      const updatedStepErrors = { ...errors.steps };
      delete updatedStepErrors[id];
      setErrors({
        ...errors,
        steps: updatedStepErrors
      });
    }
    
    toast.info("Test step removed", {
      position: "bottom-right",
      autoClose: 2000
    });
  };
  // Remove a screenshot from a step
  const removeScreenshot = (stepId) => {
    const updatedSteps = testCaseForm.steps.map(step => 
      step.id === stepId ? { ...step, screenshot: null } : step
    );
    
    setTestCaseForm({
      ...testCaseForm,
      steps: updatedSteps
    });
    
    toast.info("Screenshot removed", {
      position: "bottom-right",
      autoClose: 2000
    });
  };

  // Handle opening screenshot in a new tab
  const openScreenshotInNewTab = (screenshot) => {
    const newWindow = window.open();
    newWindow.document.write(`<img src="${screenshot}" alt="Screenshot" style="max-width: 100%; height: auto;" />`);
    newWindow.document.title = "Test Step Screenshot";
  };


  // Handle tag input
  const handleTagInputChange = (e) => {
    setCurrentTag(e.target.value);
  };

  // Add a tag
  const addTag = (e) => {
    e.preventDefault();
    if (currentTag.trim() === '') return;
    
    if (testCaseForm.tags.includes(currentTag.trim())) {
      toast.warning("Tag already exists", {
        position: "bottom-right",
        autoClose: 2000
      });
      return;
    }
    
    if (testCaseForm.tags.length >= 5) {
      toast.warning("Maximum 5 tags allowed", {
        position: "bottom-right",
        autoClose: 2000
      });
      return;
    }
    
    setTestCaseForm({
      ...testCaseForm,
      tags: [...testCaseForm.tags, currentTag.trim()]
    });
    
    setCurrentTag('');
  };

  // Remove a tag
  const removeTag = (tagToRemove) => {
    setTestCaseForm({
      ...testCaseForm,
      tags: testCaseForm.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!testCaseForm.title.trim()) {
      newErrors.title = "Title is required";
    } else if (testCaseForm.title.length > 100) {
      newErrors.title = "Title must be 100 characters or less";
    }
    
    if (testCaseForm.description.length > 500) {
      newErrors.description = "Description must be 500 characters or less";
    }
    
    // Validate steps
    const stepErrors = {};
    let hasStepErrors = false;
    
    testCaseForm.steps.forEach(step => {
      const currentStepErrors = {};
      
      if (!step.description.trim()) {
        currentStepErrors.description = "Step description is required";
        hasStepErrors = true;
      }
      
      if (!step.expectedResult.trim()) {
        currentStepErrors.expectedResult = "Expected result is required";
        hasStepErrors = true;
      }
      
      if (Object.keys(currentStepErrors).length > 0) {
        stepErrors[step.id] = currentStepErrors;
      }
    });
    
    if (hasStepErrors) {
      newErrors.steps = stepErrors;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call with timeout
      setTimeout(() => {
        setIsSubmitting(false);
        
        // Format test case for display in toast
        const summary = `${testCaseForm.title} (${testCaseForm.steps.length} steps)`;
        
        toast.success(
          <div>
            <div className="font-medium">Test case created successfully!</div>
            <div className="text-sm mt-1">{summary}</div>
          </div>,
          {
            position: "bottom-right",
            autoClose: 4000
          }
        );
        
        // Reset form
        setTestCaseForm({
          title: '',
          description: '',
          priority: 'Medium',
          prerequisites: '',
          tags: [],
          steps: [
            { id: 1, description: '', expectedResult: '', screenshot: null }
          ]
        });
        setShowPreview(false);
        setExpandedSteps([1]);
      }, 1500);
    } else {
      // Find the first error and scroll to it
      setTimeout(() => {
        const firstErrorElement = document.querySelector('.input-error');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstErrorElement.focus();
        }
      }, 100);
      
      toast.error("Please fix the errors in the form", {
        position: "bottom-right",
        autoClose: 3000
      });
    }
  };

  // Initialize expanded steps on first render
  useEffect(() => {
    setExpandedSteps([1]); // Expand the first step by default
  }, []);

  return (
    <div className="card overflow-visible">
      {/* Card Header */}
      <div className="p-5 border-b border-surface-200 dark:border-surface-700 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center">
          <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-2 mr-3">
            <PlusIcon className="w-5 h-5 text-primary dark:text-primary-light" />
          </div>
          <h2 className="text-xl font-semibold text-surface-800 dark:text-white">
            Create New Test Case
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="btn bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300"
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`btn btn-primary flex items-center ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <SaveIcon className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Test Case'}
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        {showPreview ? (
          /* Preview Mode */
          <div className="space-y-6">
            <div className="flex items-start justify-between border-b border-surface-200 dark:border-surface-700 pb-4">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-surface-800 dark:text-white">{testCaseForm.title || 'Untitled Test Case'}</h3>
                {testCaseForm.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {testCaseForm.tags.map(tag => (
                      <span key={tag} className="badge badge-primary">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <span className={`badge ${
                testCaseForm.priority === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:bg-opacity-30 dark:text-red-300' :
                testCaseForm.priority === 'High' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:bg-opacity-30 dark:text-orange-300' :
                testCaseForm.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:bg-opacity-30 dark:text-yellow-300' :
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-300'
              }`}>{testCaseForm.priority}</span>
            </div>
            
            {testCaseForm.description && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-surface-600 dark:text-surface-400">Description</h4>
                <p className="text-surface-800 dark:text-surface-200 whitespace-pre-line">{testCaseForm.description}</p>
              </div>
            )}
            
            {testCaseForm.prerequisites && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-surface-600 dark:text-surface-400">Prerequisites</h4>
                        {index + 1}
                      </div>
                      <div className="space-y-3 w-full">
                        <div>
                          <h5 className="text-sm font-medium text-surface-700 dark:text-surface-300">Step Description</h5>
                          <p className="mt-1 text-surface-800 dark:text-surface-200">{step.description}</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-surface-700 dark:text-surface-300">Expected Result</h5>
                          <p className="mt-1 text-surface-800 dark:text-surface-200">{step.expectedResult}</p>
                        </div>
                        {step.screenshot && (
                          <div>
                            <h5 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Screenshot</h5>
                            <img 
                              src={step.screenshot} 
                              alt={`Screenshot for step ${index + 1}`}
                              className="rounded-md border border-surface-200 dark:border-surface-600 max-h-64 cursor-pointer"
                              onClick={() => openScreenshotInNewTab(step.screenshot)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="label">
                    Test Case Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={testCaseForm.title}
                    onChange={handleInputChange}
                    placeholder="Enter a descriptive title"
                    className={`input ${errors.title ? 'input-error' : ''}`}
                    autoFocus
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircleIcon className="w-4 h-4 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="description" className="label">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={testCaseForm.description}
                    onChange={handleInputChange}
                    placeholder="Provide additional context for this test case"
                    rows="3"
                    className={`input resize-none ${errors.description ? 'input-error' : ''}`}
                  ></textarea>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircleIcon className="w-4 h-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-surface-500 dark:text-surface-400 flex items-center">
                    <InfoIcon className="w-3 h-3 mr-1" />
                    Maximum 500 characters
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="priority" className="label">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={testCaseForm.priority}
                    onChange={handleInputChange}
                    className="select"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="prerequisites" className="label">Prerequisites</label>
                  <textarea
                    id="prerequisites"
                    name="prerequisites"
                    value={testCaseForm.prerequisites}
                    onChange={handleInputChange}
                    placeholder="Required conditions before running this test"
                    rows="3"
                    className="input resize-none"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="tags" className="label">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {testCaseForm.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-light bg-opacity-20 text-primary-dark dark:bg-opacity-30 dark:text-primary-light"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1.5 text-primary-dark dark:text-primary-light hover:text-red-500 dark:hover:text-red-400 focus:outline-none"
                        >
                          <XCircleIcon className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      id="tags"
                      value={currentTag}
                      onChange={handleTagInputChange}
                      placeholder="Add a tag"
                      className="input rounded-r-none"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-3 bg-primary text-white rounded-r-md hover:bg-primary-dark transition-colors"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
                    Press the + button to add a tag (maximum 5)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-surface-800 dark:text-white flex items-center">
                  Test Steps
                  <span className="ml-2 text-xs bg-primary-light text-primary-dark dark:bg-primary-dark dark:text-primary-light py-0.5 px-2 rounded-full">
                    {testCaseForm.steps.length} {testCaseForm.steps.length === 1 ? 'step' : 'steps'}
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={addStep}
                  className="flex items-center text-sm px-3 py-1.5 bg-primary-light bg-opacity-10 hover:bg-opacity-20 text-primary dark:bg-primary-dark dark:bg-opacity-20 dark:hover:bg-opacity-30 dark:text-primary-light rounded-md transition-colors"
                >
                  <PlusCircleIcon className="w-4 h-4 mr-1.5" />
                  Add Step
                </button>
              </div>
              
              <div className="space-y-4">
                <AnimatePresence>
                  {testCaseForm.steps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      id={`step-${step.id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden"
                    >
                      <div className="p-3 bg-white dark:bg-surface-700 border-b border-surface-200 dark:border-surface-600 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light h-6 w-6 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                <p className="text-surface-800 dark:text-surface-200 whitespace-pre-line">{testCaseForm.prerequisites}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-surface-600 dark:text-surface-400">Test Steps</h4>
              <div className="space-y-4">
                {testCaseForm.steps.map((step, index) => (
                  <div key={step.id} className="p-4 bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light h-6 w-6 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="space-y-3 w-full">
                        <div>
                          <h5 className="text-sm font-medium text-surface-700 dark:text-surface-300">Step Description</h5>
                          <p className="mt-1 text-surface-800 dark:text-surface-200">{step.description}</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-surface-700 dark:text-surface-300">Expected Result</h5>
                          <p className="mt-1 text-surface-800 dark:text-surface-200">{step.expectedResult}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="label">
                    Test Case Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={testCaseForm.title}
                    onChange={handleInputChange}
                    placeholder="Enter a descriptive title"
                    className={`input ${errors.title ? 'input-error' : ''}`}
                    autoFocus
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircleIcon className="w-4 h-4 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="description" className="label">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={testCaseForm.description}
                    onChange={handleInputChange}
                    placeholder="Provide additional context for this test case"
                    rows="3"
                    className={`input resize-none ${errors.description ? 'input-error' : ''}`}
                  ></textarea>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircleIcon className="w-4 h-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-surface-500 dark:text-surface-400 flex items-center">
                    <InfoIcon className="w-3 h-3 mr-1" />
                    Maximum 500 characters
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="priority" className="label">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={testCaseForm.priority}
                    onChange={handleInputChange}
                    className="select"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="prerequisites" className="label">Prerequisites</label>
                  <textarea
                    id="prerequisites"
                    name="prerequisites"
                    value={testCaseForm.prerequisites}
                    onChange={handleInputChange}
                    placeholder="Required conditions before running this test"
                    rows="3"
                    className="input resize-none"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="tags" className="label">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {testCaseForm.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-light bg-opacity-20 text-primary-dark dark:bg-opacity-30 dark:text-primary-light"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1.5 text-primary-dark dark:text-primary-light hover:text-red-500 dark:hover:text-red-400 focus:outline-none"
                        >
                          <XCircleIcon className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      id="tags"
                      value={currentTag}
                      onChange={handleTagInputChange}
                      placeholder="Add a tag"
                      className="input rounded-r-none"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-3 bg-primary text-white rounded-r-md hover:bg-primary-dark transition-colors"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
                    Press the + button to add a tag (maximum 5)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-surface-800 dark:text-white flex items-center">
                  Test Steps
                  <span className="ml-2 text-xs bg-primary-light text-primary-dark dark:bg-primary-dark dark:text-primary-light py-0.5 px-2 rounded-full">
                    {testCaseForm.steps.length} {testCaseForm.steps.length === 1 ? 'step' : 'steps'}
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={addStep}
                  className="flex items-center text-sm px-3 py-1.5 bg-primary-light bg-opacity-10 hover:bg-opacity-20 text-primary dark:bg-primary-dark dark:bg-opacity-20 dark:hover:bg-opacity-30 dark:text-primary-light rounded-md transition-colors"
                >
                  <PlusCircleIcon className="w-4 h-4 mr-1.5" />
                  Add Step
                </button>
              </div>
              
              <div className="space-y-4">
                <AnimatePresence>
                  {testCaseForm.steps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      id={`step-${step.id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden"
                    >
                      <div className="p-3 bg-white dark:bg-surface-700 border-b border-surface-200 dark:border-surface-600 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light h-6 w-6 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                            {index + 1}
                          </div>
                          <h4 className="font-medium text-surface-800 dark:text-white">
                            Step {index + 1}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleStepExpansion(step.id)}
                            className="p-1 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-white transition-colors"
                            aria-label={expandedSteps.includes(step.id) ? "Collapse step" : "Expand step"}
                          >
                            {expandedSteps.includes(step.id) 
                              ? <ChevronUpIcon className="w-5 h-5" /> 
                              : <ChevronDownIcon className="w-5 h-5" />
                            }
                          </button>
                          <button
                            type="button"
                            onClick={() => removeStep(step.id)}
                            className="p-1 text-surface-500 hover:text-red-500 dark:text-surface-400 dark:hover:text-red-400 transition-colors"
                            aria-label="Remove step"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      {expandedSteps.includes(step.id) && (
                        <div className="p-4 space-y-4">
                          <div>
                            <label htmlFor={`step-${step.id}-description`} className="label">
                              Step Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              id={`step-${step.id}-description`}
                              value={step.description}
                              onChange={(e) => handleStepChange(step.id, 'description', e.target.value)}
                              placeholder="What action should be performed"
                              rows="2"
                              className={`input resize-none ${
                                errors.steps && errors.steps[step.id] && errors.steps[step.id].description
                                  ? 'input-error'
                                  : ''
                              }`}
                            ></textarea>
                            {errors.steps && errors.steps[step.id] && errors.steps[step.id].description && (
                              <p className="mt-1 text-sm text-red-500 flex items-center">
                                <AlertCircleIcon className="w-4 h-4 mr-1" />
                                {errors.steps[step.id].description}
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor={`step-${step.id}-expected`} className="label">
                              Expected Result <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              id={`step-${step.id}-expected`}
                              value={step.expectedResult}
                              onChange={(e) => handleStepChange(step.id, 'expectedResult', e.target.value)}
                              placeholder="What should happen when this step is executed"
                              rows="2"
                              className={`input resize-none ${
                                errors.steps && errors.steps[step.id] && errors.steps[step.id].expectedResult
                                  ? 'input-error'
                                  : ''
                              }`}
                            ></textarea>
                            {errors.steps && errors.steps[step.id] && errors.steps[step.id].expectedResult && (
                              <p className="mt-1 text-sm text-red-500 flex items-center">
                                <AlertCircleIcon className="w-4 h-4 mr-1" />
                                {errors.steps[step.id].expectedResult}
                              </p>
                            )}
                          
                          <div className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                              <label className="label mb-0">Screenshot</label>
                              <button
                                type="button"
                                onClick={() => handleScreenshotCapture(step.id)}
                                disabled={isCapturingScreenshot}
                                className={`flex items-center space-x-1 text-xs px-2 py-1 rounded bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300 transition-colors ${
                                  isCapturingScreenshot ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                              >
                                <CameraIcon className="w-3.5 h-3.5" />
                                <span>{isCapturingScreenshot ? 'Capturing...' : 'Capture'}</span>
                              </button>
                            </div>
                            
                            {step.screenshot && (
                              <div className="relative mt-2 border border-surface-200 dark:border-surface-600 rounded-md p-1 bg-white dark:bg-surface-800">
                                <img 
                                  src={step.screenshot} 
                                  alt={`Screenshot for step ${index + 1}`}
                                  className="w-full rounded h-auto max-h-48 object-contain"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeScreenshot(step.id)}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                  title="Remove screenshot"
                                >
                                  <XIcon className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-surface-200 dark:border-surface-700">
              <button
                type="button"
                className="btn bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn btn-primary flex items-center ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon className="w-4 h-4 mr-2" />
                    Save Test Case
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default MainFeature;