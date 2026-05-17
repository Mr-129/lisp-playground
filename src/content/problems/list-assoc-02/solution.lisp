(defun lookup-setting (key settings)
  (let ((entry (assoc key settings)))
    (if entry
        (second entry)
        nil)))