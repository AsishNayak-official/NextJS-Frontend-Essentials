"use client";
import React, { useEffect, useState } from "react";
import { Input, Form, InputProps } from "antd";
import { CloseOutlined } from "@ant-design/icons";
interface CustomInputContainerProps extends InputProps {
  containerStyle?: React.CSSProperties;
  className?: string;
  label?: string;
  maxLength?: number;
  style?: React.CSSProperties;
  onInputChange?: (value: any) => void;
  value?: string | number | undefined;
}
const InputContainer: React.FC<CustomInputContainerProps> = ({
  containerStyle,
  className,
  label,
  style,
  value,

  onInputChange,
  ...props
}) => {
  const [form] = Form.useForm();
  const [hasContent, setHasContent] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (value: string | number) => {
    const trimmedValue = value.toString().trim();
    form.setFieldsValue({ input: trimmedValue });
    setHasContent(!!trimmedValue);
    setErrorMessage(null);
    if (onInputChange) {
      onInputChange(trimmedValue);
    }
  };

  useEffect(() => {
    if (value) {
      handleInputChange(value);
    } else {
      setHasContent(false);
    }
  }, [value]);

  const handleBlur = () => {
    form.submit();
  };
  const ClassName = " ";
  return (
    <div style={{ position: "relative", ...containerStyle }}>
      <Input
        {...props}
        type="text"
        style={{borderRadius:0,...style }}
        className={ClassName + " " + className}
        onChange={(e) => {
          handleInputChange(e.target.value);
        }}
        onBlur={handleBlur}
        value={value ?? undefined}
      />
      <label
        style={{
          position: "absolute",
          top: hasContent || errorMessage ? "-20px" : "8px",
          left: "12px",
          transition: "top 0.3s, font-size 0.3s",
          pointerEvents: "none",
          fontSize: hasContent || errorMessage ? "12px" : "12px",
          color: errorMessage ? "blue" : hasContent ? "#1890FF" : "#999",
          zIndex: 1,
        }}
      >
        {label}
      </label>
      {errorMessage && <div style={{ color: "blue" }}>{errorMessage}</div>}
    </div>
  );
};
export default InputContainer;
