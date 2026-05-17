(let ((sum 0) (i 1))
  (loop
    (if (> i 5) (return (print sum)))
    (setq sum (+ sum i))
    (setq i (+ i 1))))