(defun resolve-labels (keys table)
  (mapcar (lambda (key)
            (let ((entry (assoc key table)))
              (if entry
                  (second entry)
                  "unknown")))
          keys))