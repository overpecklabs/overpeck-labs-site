import { forwardRef } from "react";

/**
 * Spam trap. Real visitors never see or reach it (off-screen, not focusable, hidden from
 * screen readers); naive bots fill every input. If it has a value, the form skips the insert
 * but still shows the normal success screen. Deliberately NOT type="hidden".
 */
const HoneypotField = forwardRef<HTMLInputElement>(function HoneypotField(_props, ref) {
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
      <label>
        Fax number
        <input ref={ref} type="text" name="fax_number" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
});

export default HoneypotField;
