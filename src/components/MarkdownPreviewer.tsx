import React, { useState, useEffect } from "react";
import { marked } from "marked";
import { Moon, Sun, Bold, Italic, List, Link } from "lucide-react";

const MarkdownPreviewer: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(() => {
    const saved = localStorage.getItem("markdown");
    return saved || "";
  });
  const [html, setHtml] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    marked.setOptions({
      breaks: true,
    });
  }, []);

  useEffect(() => {
    const parseMarkdown = async () => {
      try {
        const parsedHtml = await marked.parse(markdown);
        setHtml(parsedHtml);
      } catch (error) {
        console.error("Error parsing markdown:", error);
        setHtml("<p>Error parsing markdown</p>");
      }
    };

    parseMarkdown();
    localStorage.setItem("markdown", markdown);
  }, [markdown]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };

  const insertMarkdown = (start: string, end: string = "") => {
    const textarea = document.getElementById(
      "markdown-input"
    ) as HTMLTextAreaElement;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const textBefore = markdown.substring(0, selectionStart);
    const textAfter = markdown.substring(selectionEnd);
    const selectedText = markdown.substring(selectionStart, selectionEnd);
    const newText = `${textBefore}${start}${selectedText}${end}${textAfter}`;
    setMarkdown(newText);
    textarea.focus();
    textarea.setSelectionRange(
      selectionStart + start.length,
      selectionEnd + start.length
    );
  };

  return (
    <div className={`container mx-auto p-4 ${darkMode ? "dark" : ""}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Markdown Previewer
        </h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
        >
          {darkMode ? (
            <Sun className="text-yellow-400" />
          ) : (
            <Moon className="text-gray-700" />
          )}
        </button>
      </div>
      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => insertMarkdown("**", "**")}
          className="p-2 bg-blue-500 text-white rounded"
        >
          <Bold />
        </button>
        <button
          onClick={() => insertMarkdown("*", "*")}
          className="p-2 bg-blue-500 text-white rounded"
        >
          <Italic />
        </button>
        <button
          onClick={() => insertMarkdown("- ")}
          className="p-2 bg-blue-500 text-white rounded"
        >
          <List />
        </button>
        <button
          onClick={() => insertMarkdown("[", "](url)")}
          className="p-2 bg-blue-500 text-white rounded"
        >
          <Link />
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Input
          </h2>
          <textarea
            id="markdown-input"
            className="w-full h-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
            value={markdown}
            onChange={handleInputChange}
            placeholder="Enter your markdown here..."
          />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Preview
          </h2>
          <div
            className="w-full h-64 p-2 border border-gray-300 rounded-md overflow-auto bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 prose dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
};

export default MarkdownPreviewer;
