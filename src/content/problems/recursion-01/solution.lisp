(defun fib (n)
  (cond
    ((= n 0) 0)
    ((= n 1) 1)
    (t (+ (fib (- n 1)) (fib (- n 2))))))
(print (fib 0))
(print (fib 1))
(print (fib 10))