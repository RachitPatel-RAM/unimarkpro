import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PinInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  onComplete: (value: string) => void;
  disabled?: boolean;
}

const PinInput: React.FC<PinInputProps> = ({ 
  length, 
  value, 
  onChange, 
  onComplete, 
  disabled = false 
}) => {
  const [focusIndex, setFocusIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (value.length === length) {
      onComplete(value);
    }
  }, [value, length, onComplete]);

  const handleChange = (index: number, digit: string) => {
    if (disabled) return;
    
    const newValue = value.split('');
    newValue[index] = digit;
    const updatedValue = newValue.join('');
    
    onChange(updatedValue);
    
    if (digit && index < length - 1) {
      setFocusIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (disabled) return;
    
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      setFocusIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, length);
    onChange(pasteData);
  };

  return (
    <div className="flex justify-center space-x-3">
      {Array.from({ length }, (_, index) => (
        <motion.input
          key={index}
          ref={el => inputRefs.current[index] = el}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[index] || ''}
          onChange={e => handleChange(index, e.target.value.replace(/\D/g, ''))}
          onKeyDown={e => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => setFocusIndex(index)}
          disabled={disabled}
          className="pin-input"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          whileFocus={{ scale: 1.05 }}
        />
      ))}
    </div>
  );
};

export default PinInput;
