(defun plist-value (key plist)
  (cond
    ((null plist) nil)
    ((eq key (first plist)) (second plist))
    (t (plist-value key (rest (rest plist))))))