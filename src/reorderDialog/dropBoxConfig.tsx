import React, { FC, useId, useRef } from "react";

interface DropBoxConfigProps {
  prefixLen: number;
  setPrefixLen: (val: number) => void;
  delim: string;
  setDelim: (val: string) => void;
  startingIndex: number;
  setStartingIndex: (val: number) => void;
  expanded: boolean;
}

export const DropBoxConfig: FC<DropBoxConfigProps> = ({
  delim,
  setDelim,
  setStartingIndex,
  startingIndex,
  prefixLen,
  setPrefixLen,
  expanded,
}) => {
  const configElementRef = useRef<HTMLDivElement>(null);

  const prefixLenId = useId();
  const delimiterId = useId();
  const startingIndexId = useId();
  return (
    <div
      ref={configElementRef}
      className={[
        "file-order-dialog-items-config",
        expanded ? "file-order-expanded" : "file-order-hidden",
      ].join(" ")}
      style={{
        maxHeight: expanded ? configElementRef.current?.scrollHeight : 0,
      }}
    >
      <div className="file-order-field">
        <label htmlFor={prefixLenId}>Index Minimum Length</label>
        <input
          id={prefixLenId}
          type="number"
          min={0}
          placeholder="123"
          style={{ width: "30px" }}
          value={prefixLen}
          onChange={(e) => {
            setPrefixLen(parseInt(e.target.value, 10));
          }}
        />
      </div>

      <div
        className="file-order-field"
        title={
          delim.split("").every((c) => c === " ")
            ? `${delim.length} space${delim.length > 1 ? "s" : ""}`
            : ""
        }
      >
        <label htmlFor={delimiterId}>Delimiter</label>
        <input
          id={delimiterId}
          type="text"
          placeholder="x"
          style={{ width: "40px" }}
          value={delim}
          onChange={(e) => {
            setDelim(e.target.value);
          }}
        />
      </div>

      <div className="file-order-field">
        <label htmlFor={startingIndexId}>Starting Index</label>
        <input
          id={startingIndexId}
          type="number"
          placeholder="0"
          style={{ width: "30px" }}
          value={startingIndex}
          onChange={(e) => {
            setStartingIndex(parseInt(e.target.value, 10));
          }}
        />
      </div>
    </div>
  );
};
